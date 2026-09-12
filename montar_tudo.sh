#!/usr/bin/env bash
# Regenera o pacote inteiro a partir do zero, e já aplica os dois ajustes
# manuais que não fazem parte do build_chunks.js:
#   1) envolve a IIFE da vitrola (pag-10) em DOMContentLoaded
#   2) troca o motor de navegação antigo pelo novo (new_engine.js)
#
# Uso: ./montar_tudo.sh original.html saida/
set -e

ORIGEM="$1"
SAIDA="$2"
if [ -z "$ORIGEM" ] || [ -z "$SAIDA" ]; then
  echo "Uso: ./montar_tudo.sh original.html saida/"
  exit 1
fi

rm -rf "$SAIDA"
node build_chunks.js "$ORIGEM" "$SAIDA"

echo ""
echo "Aplicando ajuste manual 1/2: vitrola do pag-10..."
python3 - "$SAIDA" << 'PYEOF'
import sys, re
saida = sys.argv[1]
caminho = f"{saida}/js/core.js"
with open(caminho, encoding="utf-8") as f:
    texto = f.read()

velho_abre = "(function() {\n    const btn = document.getElementById('btn-player-2');"
novo_abre = "(function() {\n    document.addEventListener('DOMContentLoaded', function() {\n    const btn = document.getElementById('btn-player-2');"
assert velho_abre in texto, "IIFE da vitrola nao encontrada (abertura) - verifique manualmente"
texto = texto.replace(velho_abre, novo_abre, 1)

velho_fecha = ("            document.getElementById('container-vitrola-2').style.display = 'none';\n"
               "            document.querySelector('.texto-suspense').style.display = 'none';\n"
               "            document.getElementById('quiz-recompensa-2').style.display = 'block';\n"
               "        });\n"
               "    }")
novo_fecha = velho_fecha + "\n    });"
assert velho_fecha in texto, "IIFE da vitrola nao encontrada (fechamento) - verifique manualmente"
texto = texto.replace(velho_fecha, novo_fecha, 1)

with open(caminho, "w", encoding="utf-8") as f:
    f.write(texto)
print("  ok.")
PYEOF

echo "Aplicando ajuste manual 2/2: motor de navegação assíncrono..."
python3 - "$SAIDA" << 'PYEOF'
import sys
saida = sys.argv[1]
caminho = f"{saida}/js/core.js"
with open(caminho, encoding="utf-8") as f:
    linhas = f.readlines()

with open("new_engine.js", encoding="utf-8") as f:
    novo = f.read()

marcador_inicio = "    // NAVEGAÇÃO, ÁUDIO E CONTROLE VIP\n"
marcador_fim_func = "    function irParaTela(idAlvo) {\n"

idx_inicio = None
for i, l in enumerate(linhas):
    if l == marcador_inicio:
        idx_inicio = i - 2  # duas linhas acima: o "// ====...==" que abre o comentário
        break
assert idx_inicio is not None, "marcador de inicio do motor de navegacao nao encontrado"

idx_fim_func = None
for i, l in enumerate(linhas):
    if l == marcador_fim_func:
        idx_fim_func = i
        break
assert idx_fim_func is not None, "funcao irParaTela nao encontrada"

# acha o fechamento "    }" dessa funcao (primeira linha "    }" sozinha depois dela)
idx_fim = None
for i in range(idx_fim_func, len(linhas)):
    if linhas[i] == "    }\n":
        idx_fim = i + 1
        break
assert idx_fim is not None, "fechamento da funcao irParaTela nao encontrado"

antes = "".join(linhas[:idx_inicio])
depois = "".join(linhas[idx_fim:])
with open(caminho, "w", encoding="utf-8") as f:
    f.write(antes + novo + "\n" + depois)
print(f"  ok (substituidas linhas {idx_inicio+1} a {idx_fim}).")
PYEOF

node --check "$SAIDA/js/core.js" && echo "core.js: sintaxe OK"
echo ""
echo "Pronto. Pacote gerado e corrigido em: $SAIDA"
