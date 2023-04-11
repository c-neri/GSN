import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, polygon, hardhat, polygonMumbai } from 'wagmi/chains';
import { GSNConnector } from '@/connectors/GSN';

const chains = [mainnet, polygon, hardhat, polygonMumbai]
const { provider, webSocketProvider } = configureChains(
  [mainnet, polygon, hardhat, polygonMumbai],
  [publicProvider()],
)

const client = createClient({
  autoConnect: false,
  connectors: [
    new GSNConnector({ chains }),
  ],
  provider,
  webSocketProvider,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
