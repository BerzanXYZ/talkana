import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Talkana } from "../target/types/talkana";

describe("talkana", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Talkana as Program<Talkana>

  it("Send a new message!", async () => {
    const msg = anchor.web3.Keypair.generate()
    
    const tx = await program.rpc.sendMessage("solana", "I love solana!", {
      accounts: {
        message: msg.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [msg]
    })

    const msgAccount = await program.account.message.fetch(msg.publicKey)
    
    assert.equal('solana', msgAccount.topic)
    assert.equal('I love solana!', msgAccount.content)
    assert.equal(msgAccount.author.toBase58(), provider.wallet.publicKey.toBase58())
    assert.ok(msgAccount.timestamp)
  })

  it("Send a message without topic!", async () => {
    const msg = anchor.web3.Keypair.generate()

    const tx = await program.rpc.sendMessage("", "Hey, everyone!", {
      accounts: {
        author: provider.wallet.publicKey,
        message: msg.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [msg]
    })

    const msgAccount = await program.account.message.fetch(msg.publicKey)

    assert.equal(msgAccount.topic, '')
  })

  it("Can't send a message whose content has more than 64 characters!", async () => {
    try {
      const msg = anchor.web3.Keypair.generate()
      const tx = await program.rpc.sendMessage('test', 'I wanna send a long message'.repeat(10), {
        accounts: {
          author: provider.wallet.publicKey,
          message: msg.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [msg]
      })
    } catch (e) {
      assert.equal(e.error.errorMessage, "Content characters count shoudln't exceed 64!")
      return
    }
    assert.fail("Not expected: Users can send messages whose content has more than 64 characters!")
  })


})