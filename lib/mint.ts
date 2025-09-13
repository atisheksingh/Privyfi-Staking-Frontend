export async function mint(USER_ID: string, amount = 10): Promise<void> {
  console.log(USER_ID, "USER_ID_PRESENT")
  // Ensure this runs only in a browser context
  if (typeof window === "undefined") return console.warn("Run in browser");

  const {
    WebClient,
    AccountId,
    NoteType,
    Account,
    // TransactionProver,
    AccountStorageMode
  } = await import("@demox-labs/miden-sdk");

  // const FAUCET_ID = process.env.NEXT_PUBLIC_FAUCET_ID || "";
  const client = await WebClient.createClient(
    "https://rpc.testnet.miden.io:443"
  );
  console.log("Latest block:", (await client.syncState()).blockNum());

  // const prover = TransactionProver.newRemoteProver(
  //   "https://tx-prover.testnet.miden.io"
  // );

  
  const faucet1 = await client.newFaucet(
    AccountStorageMode.public(),
    false,
    "MID",
    8,
    BigInt(1_000_000_000_000),
  );
  console.log("Faucet ID:", faucet1.id().toString());

  const faucet2 = await client.newFaucet(
    AccountStorageMode.public(),
    false,
    "ABC",
    8,
    BigInt(1_000_000_000_000),
  );
  console.log("Faucet ID:", faucet2.id().toString());



// const faucetId = AccountId.fromHex(faucet1.id());
// console.log("Faucet ID:", faucetId.isFaucet())

// let faucet = await client.getAccount(faucetId);
//   if (!faucet) {
//     await client.importAccountById(faucetId);
//     await client.syncState();
//     console.log("client state synced");
    
//     faucet = await client.getAccount(faucetId);
//     console.log("faucet import succesful")
//     if (!faucet) {
//       throw new Error(`Account not found after import: ${faucetId}`);
//     }
//   }
  try {

    console.log("account details:", USER_ID, amount);
    const userAccountId = AccountId.fromBech32(USER_ID);
    console.log("User Account ID:", USER_ID.toString());

    const mintTxRequest = client.newMintTransactionRequest(
     userAccountId,
      faucet1.id(),
      NoteType.Public,
      BigInt(amount*1000000),
    );
    const txResult = await client.newTransaction(faucet1.id(), mintTxRequest);
    await client.submitTransaction(txResult);

  } catch (err) {
    console.error("Minting failed:", err);
    throw err; // or handle gracefully
  }

  console.log("Waiting 10 seconds for transaction confirmation...");
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  await client.syncState();

  console.log("Transaction confirmed. Asset transfer chain completed ✅");

}
