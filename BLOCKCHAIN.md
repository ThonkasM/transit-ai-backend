# 🔗 Módulo Blockchain — Billetera y Pagos

Sistema de billeteras digitales y pago de pasajes sobre una blockchain local
(Hardhat + Solidity), integrado al backend NestJS.

## ¿Qué hace?

| Caso de uso | Cómo se implementa |
|---|---|
| Billeteras vinculadas a la cuenta | Cada usuario obtiene una dirección on-chain (modelo custodial) |
| Carga de saldo (tarjeta/transferencia) | El backend acuña (`mint`) tokens `TRC` tras validar el pago |
| Pago de pasaje por QR | El pasajero genera un QR firmado; el chofer lo escanea y cobra |
| Registro inmutable on-chain | Cada operación es una transacción + evento en la blockchain |
| Distribución automática | El smart contract reparte: 80% sindicato / 15% chofer / 5% sistema |
| Historial y saldo | Saldo leído del contrato; historial espejado en PostgreSQL |
| Abono / pase mensual | Pago on-chain con validez de 30 días (sin NFT) |
| Descuentos automáticos | Categoría on-chain: ESTUDIANTE 50%, ADULTO_MAYOR 30% |

El token `TRC` usa 2 decimales (1 unidad = 1 centavo de Boliviano).

## Arquitectura

```
blockchain/                      ← proyecto Hardhat (independiente)
  contracts/TransitPay.sol       ← único smart contract (ERC-20 + lógica de pagos)
  scripts/deploy.ts              ← despliega y guarda dirección + ABI
  deployments/localhost.json     ← lo lee el backend

src/blockchain/                  ← puente NestJS ↔ contrato (ethers.js)
src/billetera/                   ← billetera, recarga, pago, QR, abono, historial
```

## Cómo levantarlo (3 terminales)

```bash
# 1) Instalar dependencias de la blockchain (solo la primera vez)
cd blockchain
npm install
npm run compile

# 2) TERMINAL A — nodo blockchain local (déjalo corriendo)
cd blockchain
npm run node

# 3) TERMINAL B — desplegar el contrato (una vez por reinicio del nodo)
cd blockchain
npm run deploy
#   → genera blockchain/deployments/localhost.json

# 4) TERMINAL C — backend NestJS
npm run start:dev
```

> ⚠️ Si reinicias el nodo Hardhat, vuelve a ejecutar `npm run deploy` (la cadena
> se reinicia desde cero). La dirección del contrato suele ser la misma.

## Variables de entorno (.env)

```env
BLOCKCHAIN_RPC_URL="http://127.0.0.1:8545"
BLOCKCHAIN_NETWORK="localhost"
BLOCKCHAIN_OWNER_KEY="0xac09...ff80"   # cuenta #0 de Hardhat (solo desarrollo)
WALLET_ENCRYPTION_KEY="..."             # cifra las llaves privadas custodiales
BILLETERA_QR_SECRET="..."               # firma los tokens QR
```

Si falta `BLOCKCHAIN_OWNER_KEY` o no existe el despliegue, el módulo se
deshabilita solo y los endpoints responden 503 (el resto del backend sigue ok).

## Endpoints (todos requieren JWT)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/billetera` | Crea/devuelve la billetera del usuario |
| GET | `/billetera` | Saldo y datos de la billetera |
| POST | `/billetera/recargar` | Recarga saldo `{ monto, metodo?, referencia? }` |
| POST | `/billetera/pagar` | Paga pasaje de una línea `{ lineaId }` |
| GET | `/billetera/qr` | Genera el QR de pago del pasajero |
| POST | `/billetera/pagar-qr` | El chofer cobra escaneando `{ qr, lineaId }` |
| POST | `/billetera/abono` | Compra abono mensual `{ lineaId? }` |
| GET | `/billetera/abono` | Abono vigente |
| GET | `/billetera/historial` | Últimas 50 transacciones |
| POST | `/billetera/:usuarioId/categoria` | Asigna descuento a un usuario `{ categoria }` (admin) |
| GET | `/billetera/config` | Configuración vigente (descuentos, reparto, abono) |
| PATCH | `/billetera/config/descuento` | Cambia descuento `{ categoria, porcentaje }` (admin) |
| PATCH | `/billetera/config/reparto` | Cambia reparto `{ sindicato, chofer }` en % (admin) |

### Qué es configurable

| Parámetro | Cómo se cambia |
|---|---|
| **Tarifa de cada línea** | CRUD de líneas (`PATCH /lineas/:id`, campo `tarifa`) |
| **Descuentos** por categoría | `PATCH /billetera/config/descuento` (on-chain, en vivo) |
| **Reparto** sindicato/chofer/sistema | `PATCH /billetera/config/reparto` (on-chain, en vivo) |
| **Abono** (viajes y validez) | `.env` → `ABONO_VIAJES`, `ABONO_DIAS` |

> Los endpoints de configuración requieren rol `SUPERADMIN` o `SINDICATO_ADMIN`.

## Smart contract `TransitPay`

- `recargar(usuario, monto)` — acuña saldo (solo owner/backend)
- `pagarPasaje(pasajero, sindicato, chofer, tarifaBase)` — cobra + reparte + descuento
- `comprarAbono(pasajero, sindicato, precio, validoHasta)` — pago de abono
- `asignarCategoria(usuario, categoria)` — descuento por categoría
- `setReparto / setDescuento` — ajustar porcentajes (solo owner)
