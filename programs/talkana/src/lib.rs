use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod talkana {
    use super::*;

    pub fn send_message(ctx: Context<SendMessage>, topic: String, content: String) -> Result<()> {
        let message = &mut ctx.accounts.message;
        let author = &ctx.accounts.author;
        let clock = Clock::get().unwrap();

        if topic.chars().count() > 16 {
            return Err(ErrorCode::TopicLimitExceeded.into())
        }
        if content.chars().count() > 64 {
            return Err(ErrorCode::ContentLimitExceeded.into())
        }

        message.author = *author.key;
        message.timestamp = clock.unix_timestamp;
        message.topic = topic;
        message.content = content;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendMessage<'info> {
    // Message account
    #[account(init, payer = author, space = Message::LEN)]
    pub message: Account<'info, Message>,
    // Signer account
    #[account(mut)]
    pub author: Signer<'info>,
    // System program
    pub system_program: Program<'info, System>

}

#[error_code]
pub enum ErrorCode {
    #[msg("Topic characters count shouldn't exceed 16!")]
    TopicLimitExceeded,
    #[msg("Content characters count shoudln't exceed 64!")]
    ContentLimitExceeded,
}

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