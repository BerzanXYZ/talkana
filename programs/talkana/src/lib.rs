use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod talkana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct Message {
    pub author: Pubkey, // 32 bytes
    pub timestamp: i64, // 8 bytes
    pub topic: String, // 4 + 16*4 bytes
    pub content: String, // 4 + 64*4 bytes
}

impl Message {
    // Byte length that'll be rent on Solana
    const LEN: usize = 32 + 8 + (4 + 16*4) + (4 + 64*4);
    
}