# Agente Reciclador - Algoritmo de ida até a lixeira

O projeto é para testar os algoritmos feitos para um `agente` chegar até uma `lixeira`.

## Como funciona ?

Vamos usar uma matriz de `10 x 10`

### 1) Acesse o link do projeto.

Acesse [ Clicando nesse Link ](http://expalmer.github.io/agente-reciclador-algoritmo/)

### 2) Crie o ambiente.

Preencha a grade com o `agente`, `lixeira` e os obstaculos onde preferir.

Para isso, clique dentro da grade.


### 3) Exporte a matriz.

Digite no terminal ao lado:
```shell
$ export csv
```

Então vai aparecer a matriz logo abaixo, copie ela e cole num arquivo ``.csv`` ou `.txt` para você importar para seu programa.

### 4) Seu Algoritmo.

Agora é com você, faça o **parse** da string, passe no seu algoritmo ( faça seus ``paranauês`` ) e retorne uma string com este formato:

```shell
1,2|1,3|1,4|1,5|2,5|3,5|4,5
```

Essa string significa `x,y` separados por `pipe` tá ligado ? Sim né!


### 5) Importe sua string.

Digite no terminal ao lado:
```shell
$ import seunome 1,2|1,3|1,4|1,5|2,5|3,5|4,5
```

Aqui você coloca o `import` + `seunome` + `string`. O parametro `seunome` é como iremos executar logo a seguir.

### 6) Fazer o agente andar até a lixeira

Digite no terminal ao lado:
```shell
$ exec seunome
```

Pronto! Agora basta ver o agente indo até a lixeira.