---
slug: "2025-07-14-cryptozombies-lección-2-guía-definitiva-y-código-completo-2247484699"
title: "CryptoZombies Lección 2: Guía Definitiva y Código Completo"
authors: [w0x7ce]
tags: [微信公眾號]
date: 2025-07-14
description: "从微信公众号导入的文章《CryptoZombies Lección 2: Guía Definitiva y Código Completo》，保留原始排版图并提供本地 OCR 转写。"
---

# CryptoZombies Lección 2: Guía Definitiva y Código Completo

> 发布于 2025-07-14 23:14:36（微信公众号导出记录）。
>
> 本文来自公众号后台的“导出文章内容”功能。博客正文由导出长图进行本地 OCR 转写，并保留原始排版图用于逐段核对。
>
> 原文链接：[查看原文](http://mp.weixin.qq.com/s?__biz=MzIwMjMyNzIzNw==&mid=2247484699&idx=1&sn=f81d3ec8491a2aff0ee35c631db397a5&chksm=96e110b1a19699a71eaba67e3bc5057f9acddec4d065e67872ab375fa638a35fb30f68476282#rd)
>
> OCR 转写有效文字约 8354 字；代码、流程图和版式以文末原始排版图为准。

## 正文（本地 OCR 转写）

CryptoZombies Lecci6n 2: Guia Definitiva y C6digo
Completo
wex7ce EI V1ajero 2825年7月14日 23:14 中国垂港
OT10

Enhorsbuensl (Has complersdo la Leccin 2 de
CryploZombies!
reats Co
oty-rayer a tsamigos

## 1.Resumen de Conocimientos Clave

En la Leccion 2, afiadimos las funcionalidades principales para un
los conceptos clave cubiertos en esta leccion:

- Tipos de Datos Esenciales:

oaddress: Un tipo de dato especff1co de Solidity ut1l1zado
para almacenar direcciones de cuentas de Ethereum (por
ejemplo, @x...). Es la base para implementar la propiedad
del usuario.
omapping: Una estructura de alnacenamiento de clave-valor,
similar a una tabla hash o un diccionario (mapping(TipoClave

- &gt;TipoValor)).Es extremadamente eficiente para asociar

datos (como la propiedad) con una direccion o ID especifico.

- Gestion de Propiedad y Acceso:

msg.sender: Una variable global que siempre representa la
direccion de la cuenta o contrato que esta llamando a la
funcion actual. Es la herramienta mas inportante en Los
contratos inteligentes para la autenticacion y la asignaci6n
automatica de propiedad.
o require(condicion): Una funcion de validacion que se utiliza
para conprobar si una condicion es verdadera antes de
ejecutar el codigo. Si la condici6n es false, la transacci6n
falla y revierte todos los camb1os de estado. Es clave para
hacer cunplir reglas (por ejemplo,"cada d1recc16n solo
puede crear un zombi gratis").

- Estructura y Organizaci6n del C6digo:

o Herencia (is): Solidity permite que un contrato herede las
caracteristicas de otro. Un contrato hijo puede usar la
sintaxis is ContratoPadre para acceder a todas las funciones
y variables de estado public e internal del contrato padre,
lo que pronueve enormemente la reutilizacion y modularidad
delcodigo.
oInportacion (import): Cuando el codigo se divide en varios
archivos, es necesario usar inport "./ruta/al/archivo.sol";
para incluir el contenido de otros archivos, permitiendo que
elcompilador enlace y compile correctanente todo el
proyecto.
o Visibilidad de Funciones (internal vs private):

- private: La funci6n solo puede ser llamada desde dentro

del contrato donde se define.

- internal: La funcion puede ser llamada desde el contrato

donde se define y desde cualquier contrato hijo que herede
de él. Para implementar la herencia, a menudo necesitamos
camb1ar la visib1l1dad de las funciones aux1l1ares del
padre de private a internal.

- Interaccion con Otros Contratos:

o Interfaces (interface): Una interfaz es la forma estandar de
interactuar con contratos externos. Solo declara las firmas
de las funciones del contrato objetivo &#123;nombre. parametros,
valores de retorno). sin ningun codigo de 1mplementacion.
Esto permite que nuestro contrato llame de forma segura a
las funciones publicas de otro contrato sin necesidad de
tener su codigo fuente.
cManejo de Miltiples Valores de Retorno: Las funciones de
Solidity pueden devolver multiples valores. Al recibirlos,
edneunJesn
sowapod
(valorl,
valor2,
eued(...
capturarlos todos. Si solo nos interesan algunos, podemos
usar una coma , para omitir los valores que no neces1tamos,
por ejemplo (,,,valor4,,).

- Manejo de Datos Complejos:

o storage vs memory: Este es un concepto clave en Solidity
sobre la ubicacion de almacenamiento de datos.

- storage: Los datos se guardan permanentemente en la

blockchain. Modificarlos tiene un alto costo (consume
Gas ) .
memory: Los datos existen solo temporalmente durante la
ejecucion de una funcion y se destruyen al finalizar. Su
costo es menor.
Al manipular variables de estado dentro de una funcion
(como un struct en un array). crear un puntero a storage
(TipoStruct storage puntero = -.-) nos permite modificar
directamente los datos en la blockchain, en lugar de crear
una copia temporal.

## 2. Desafio Final

conpleta
Basado en todos
los conocimientos anteriores,
la
siguiente tarea:
Crea dos archivos de contrato inteligente, zombiefactory.sol y
zombiefeeding.sol.

## 1.zombiefactory.sol debe contener:

o La estructura de datos basica para un zombi (Zonbie struct).
o Un array para almacenar todos los zombis.
o napping para rastrear la propiedad de los zonbis y el
recuento de zombis por propietario.
o Una funci6n internal
_createZombie que maneje la l6gica
central de creac16n de zomb1s, as1gnac16n de prop1edad y
actualizaci6n del recuento,
o Una funcion public createRandomZombie que debe usar require
para garantizar que cada jugador solo pueda llamarla una vez
de forma gratuita.

## 1.zombiefeeding.sol debe contener:

o Usar 1mport para 1ncluir zombiefactory.sol.
o Usar la palabra clave is para heredar de ZombieFactory.
o Definir una KittyInterface para interactuar con el contrato
de CryptoKitties.
o Instanciar esa 1nterfaz, apuntando a su d1recc1on en la red
principal de Ethereum.
o Crear una funci6n feed0nKitty que pueda:

- Recibir el ID de nuestro zonbi y el ID de un CryptoKitty

objetivo.

- Llamar a la funcion getKitty del contrato externo

capturar solo el valor de retorno genes que necesitamos.

- Llamar a una funci6n principal feedAndMultiply para

manejar la l6gica posterior.
o La funcion feedAndMultiply debe ser capaz de:

- Verificar que quien llama a la funcion es el propietario

del zombi.

- Usar un puntero a storage para obtener los datos de

nuestro zomb1.

- Calcular el nuevo ADN del zombi (el promedio entre nuestro

zomb1 y el objetivo).

- Si el objetivo es un "kitty*, aplicar un tratamiento

especial al nuevo ADN (los dos iltimos dfgitos cambian a

## 99) .

- Llamar a la funcion _createZombie del contrato padre para

crear finalmente el nuevo zombi.

## 3.Soluci6n Completa

A continuacion se muestra el codigo completo de los dos archivos
necesarios para completar el desaffo final.
Archivo: zombiefactory.sol

pragma solidity &gt;=0.5.0 &lt;0.6.0;
contract ZombieFactory&#123;
// Evento: se dispara cuando se crea un nuevo zombi, facilitando l
event NewZombie(uint zombieId, string name, uint dna);
// Variables de estado
uint dnaDigits = 16;
// Estructura de datos del Zombi
struct Zombie &#123;
string name;
10
&#58;eup lutn
1 1
1 2
// Variables de estado
13
14
Zombie[] public zombies;
15
16
mapping (address =&gt; uint) public ownerZombieCount;
17
// Funcion interna: logica principal para crear un nuevo zombi.
18
// Se declara como internal" para que los contratos hijos puedan
function _createzombie(string memory _name, uint _dna) internal &#123;
19
20
uint id = zombies .push(Zombie(_name, _dna)) - 1;
21
zombieToowner [id] = msg.sender;
22
23
emit NewZombie (id, _name, _dna) ;
24
// Funcion publica: crea un zombi aleatorio para el primer zombi g
25
26
function createRandomZombie(string memory _name) public &#123;
27
// Requisito: el llamante no debe poseer ningun zombi todavia.
require(ownerZombieCount[msg sender] == θ);
28
29
uint randDna = uint (keccak256(abi.encodePacked(now, msg.sender
30
_createZombie(_name, randDna);

Archivo: zombiefeeding.sol

pragma solidity &gt;=0.5.0 &lt;0.6.0;
// l. Importar el archivo del contrato padre.
import "./zombiefactory.sol";
4// 2. Definir la interfaz del contrato externo.
interface KittyInterface &#123;
function getKitty(uint256 _id) external view returns (
bool isGestating,
bool isReady,
uint256 cooldownIndex,
10
uint256 nextActionAt,
1 1
uint256 birthTime,
12
13
14
uint256 sireId,
15
uint256 generation,
16
);
1 7
18
&#125;
19 // 3. Definir el contrato hijo y heredar del padre.
contract ZombieFeeding is ZombieFactory &#123;
20
// 4. Instanciar la interfaz del contrato externo.
21
address ckAddress = θx06θ12c8cf97BEaD5deAe237070F9587f8E7A266d;
22
KittyInterface kittyContract = KittyInterface(ckAddress);
23
// Logica principal de alimentacion y multiplicacion.
24
function feedAndMultiply(uint _zombieId,uint _targetDna,string m
25
26
// Verificar que el llamante es el propietario de este zombi.
27
require(msg.sender == zombieToowner[_zombieId]);
28
29
// Usar un puntero a storage para referenciar directamente l
30
Zombie storage myZombie = zombies[_zombieId];
31
32
// Calcular el nuevo ADN.
33
_targetDna = _targetDna % dnaModulus;
uint newDna = (myZombie.dna + _targetDna) / 2;
34
35
// Si se alimenta de un gato, anadir los genes especiales
36
if (keccak256(abi.encodePacked(_species)) == keccak256(abi.enc
37
newDna = newDna - newDna % 100 + 99;
38
)
39
//Llamar a la funcion internal&#96; del contrato padre para crea
40
_createZombie("NoName", newDna) ;
41
&#123;
42
// Permite a un zombi alimentarse de un Cryptokitty.
function feedonKitty(uint _zombieId, uint _kittyId) public &#123;
4 4
uint kittyDna;
45
// Llamar a la funcion del contrato externo y recibir solo el
46
(,......,,kittyDna) = kittyContract.getKitty(_kittyId);
47
// Llamar a nuestra propia funcion de l6gica principal.
feedAndMultiply(_zombieId, kittyDna,"kitty");
48
4 9

## 原始排版图

![CryptoZombies Lección 2: Guía Definitiva y Código Completo：微信公众号导出原始排版图](/img/wechat/2025-07-14-cryptozombies-lección-2-guía-definitiva-y-código-completo-2247484699/article.webp)
