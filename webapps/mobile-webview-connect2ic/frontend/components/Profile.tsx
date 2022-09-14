export {}
// import { useBalance, useWallet } from "../services/hooks"
// import React from "react"

// const Profile = ({ connected }: { connected: boolean }) => {
//   const [wallet] = useWallet({ connected })
//   const [assets] = useBalance({ connected })

//   return (
//     <div className="example">
//       {wallet ? (
//         <>
//           <p>
//             Wallet address:{" "}
//             <span style={{ fontSize: "0.7em" }}>
//               {wallet ? wallet.principal : "-"}
//             </span>
//           </p>
//           <table>
//             <tbody>
//               {assets &&
//                 assets.map((asset) => (
//                   <tr key={asset.canisterId}>
//                     <td>{asset.name}</td>
//                     <td>{asset.amount}</td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </>
//       ) : (
//         <p className="example-disabled">
//           Connect with a wallet to access this example
//         </p>
//       )}
//     </div>
//   )
// }

// export { Profile }
