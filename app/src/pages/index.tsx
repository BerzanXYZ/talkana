import type { NextPage } from 'next'
import { Main } from '../components/Main'
import Head from 'next/head'
import Image from 'next/image'
import { BottomBar } from '../components/BottomBar'
import { Page } from '../components/Page'
import { BrandLabel, TopBar } from '../components/TopBar'

const Home: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Talk on Solana - Talkana</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <TopBar>
        <BrandLabel/>
      </TopBar>
      <Main>
        f
      </Main>
      <BottomBar>

      </BottomBar>
    </Page>
  )
}

export default Home
