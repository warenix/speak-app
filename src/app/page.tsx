import Head from 'next/head';
import VoiceRecognition from './components/VoiceRecognition';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Voice Recognition App</title>
      </Head>
      <main>
        <h1 className="text-3xl font-bold mb-4">Voice Recognition App</h1>
        <VoiceRecognition />
      </main>
    </div>
  );
};

export default Home;
