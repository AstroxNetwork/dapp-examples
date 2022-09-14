# Integration Guide

This example will show you how to integrate with `AstroXWebviewHandler` while Webapp runs in ME or AstroX supported Webview.
It uses sdk of `@astrox/sdk-core` and `@astrox/sdk-webview` directly, if you need another example of `Connect2IC`, please refer to other example.

## Quick Start

1. Prepare a DApp page or clone this demo, deployed to mainnet.
2. Install Demo App, register a demo account.
3. Click open Demo App, goes to "My" tab, and input your url
4. Login and test your apis

## Principles and diagram

**Identity is different from Wallet, DO NOT MIX THEM UP**

1. Use `Identity` to allow user to keep login handle and for interaction purpose
2. If you use `Identity.principal` to create a wallet, or store some NFT. These assets may stay in your App, not portable. Users will find it hard to use the wallet elsewhere.
3. Always use `wallet` object and functions to call user's wallet as payment methods, use it for transfer tokens or NFTs
4. `Identity` may be different across different apps, but `Wallet` is globally used.

## APIs

```typescript
export declare class AstroXWebViewHandler implements IWalletConnector {
  /// -------------------------------
  ///
  ///   Connection Methods
  ///
  /// -------------------------------
  /// static function create this handler, useful when you don't need to initialize this handler first
  static create(params: WebViewConnectRequest): Promise<AstroXWebViewHandler>
  ///  **Important** mainly used function in many use case, useful when integrate with `Connect2IC`
  connect(params: WebViewConnectRequest): Promise<boolean>
  /// force reconnect this handler
  reconnect(params: WebViewConnectRequest): Promise<boolean>
  /// load data from `AbstractedClientStorage` and try initialize this handler, automatically used in `connect` method
  fromStorage(): Promise<AstroXWebViewHandler>
  /// **Important** see if the handler is ready to make api call,
  isReady(): boolean
  /// see if the handler is correctly connected to host env
  isConnected(): Promise<boolean>
  /// logout current account
  disconnect(): Promise<boolean>
  /// signMessage, NOT implemented but needed in abstracted interface
  /// -------------------------------
  ///
  ///   Wallet Methods
  ///
  /// -------------------------------
  /// get `Wallet` Object after connected
  get wallet(): Wallet
  /// requestTransfer NFT or supported token, use current Wallet api
  requestTransfer(req: TransferNFTWithIdentifier | TransferToken): Promise<any>
  /// query balance with current Wallet balance
  queryBalance(): Promise<
    {
      amount: number
      canisterId: string
      decimals: number
      image?: string
      name: string
      symbol: string
    }[]
  >
  /// get supported token list of handler
  getSupportedTokenList(): Promise<
    Array<{
      symbol: string
      standard: string
    }>
  >
  /// get Wallet object, principal, and accountId included, used for ethereum style
  address(): {
    principal?: string
    accountId?: string
  }
  /// -------------------------------
  ///
  ///   Identity members and  Methods
  ///
  /// -------------------------------
  /// get `identity` after connected
  get identity(): SignIdentity
  /// get `DelegationChain` when you need it export to somewhere else
  getDelegation(): DelegationChain
  /// get `PublicKey ` of current logged-in account
  getPublicKey(): PublicKey
  /// get `Principal` of current logged-in account
  getPrincipal(): Principal

  /// createActor for your actor
  createActor: <T>(
    canisterId: string,
    idlFactory: InterfaceFactory,
  ) => Promise<ActorSubclass<T>>
  /// -------------------------------
  ///
  ///   Members getters and setters
  ///
  /// -------------------------------
  /// set `agent` if you find agent is needed to change
  setAgent(value: HttpAgent): void
  /// get `agent` after connected
  get agent(): HttpAgent
  /// set `storage` if you use other storage method other than `localStorage` used here, but needed to implement with `AbstractedClientStorage`
  setStorage(storage: AbstractedClientStorage): void
  /// get `storage` when you need to export some data out of your `AbstractedClientStorage`
  get storage(): AbstractedClientStorage
  /// clear local storage and other members inside this class
  autoClear(): Promise<void>
  /// -------------------------------
  ///
  ///   NOT implemented Methods
  ///
  /// -------------------------------
  /// Not implemented but needed in abstracted interface
  signMessage(message: any): Promise<any>
  /// Not implemented but needed in abstracted interface
  config: any
  /// Useful when integrated to Connect2IC
  init(): Promise<any>
}
```
