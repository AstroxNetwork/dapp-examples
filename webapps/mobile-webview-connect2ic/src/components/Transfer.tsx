export {}
// import { useTransfer, useWallet } from "../services/hooks"
// import React from "react"
// import { Cbor } from "@dfinity/agent"
// import { toHexString } from "@dfinity/candid"

// const Transfer = ({ connected }: { connected: boolean }) => {
//   const [wallet] = useWallet({ connected })
//   const [transfer] = useTransfer({
//     connected,
//     to: "848753b6fac50019dffc34ead1af095863405b3cce463352c1ecf3109ada4b23",
//     amount: BigInt(1000000),
//   })

//   const onPurchase = async () => {
//     try {
//       // const { height } = await transfer()
//       await transfer()
//     } catch (error) {
//       alert(error)
//     }
//   }

//   return (
//     <div className="example">
//       {wallet ? (
//         <>
//           <p>Buy me beer</p>
//           <button className="connect-button" onClick={onPurchase}>
//             Purchase
//           </button>
//         </>
//       ) : (
//         <p className="example-disabled">
//           Connect with a wallet to access this example
//         </p>
//       )}
//     </div>
//   )
// }

// export { Transfer }
