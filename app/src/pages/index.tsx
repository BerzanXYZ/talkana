import type { NextPage } from 'next'
import { Main } from '../components/Main'
import Head from 'next/head'
import { BottomBar } from '../components/BottomBar'
import { Page } from '../components/Page'
import { BrandLabel, TopBar } from '../components/TopBar'
import Message from '../components/Message'
import CreateMessage from '../components/CreateMessage'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTalkana } from '../contexts/TalkanaProvider'
import { LinkText, Text } from '../components/Text'

const Home: NextPage = () => {
  const { allMessages } = useTalkana()

  return (
    <Page>
      <Head>
        <title>Talk on Solana - Talkana</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <TopBar>
        <BrandLabel/>
        <WalletMultiButton/>
      </TopBar>

      <Main>
        <CreateMessage/>
       {allMessages.map((m, i) => <Message key={i+100} author={m.author} content={m.content} timestamp={m.timestamp} topic={m.topic}/>)}
      </Main>
      <BottomBar>
        <Text>Visit the <LinkText href='https://github.com/BerzanXYZ/talkana'>repo</LinkText> by Berzan 🌊</Text>
      </BottomBar>
    </Page>
  )
}

export default Home
