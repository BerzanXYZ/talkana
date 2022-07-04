import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Talkana } from "../target/types/talkana";

describe("talkana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Talkana as Program<Talkana>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
