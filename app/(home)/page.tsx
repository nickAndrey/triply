import { Suggestions } from './_components/suggestions';

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] max-w-5xl m-auto px-4 py-5">
      <Suggestions
        suggestions={[
          {
            id: '1',
            imgSrc:
              'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Rome, Italy',
            description:
              'Step into the Eternal City — explore ancient ruins, vibrant piazzas, and world-famous cuisine. From the Colosseum to hidden trattorias, Rome is where history and modern life meet.',
          },
          {
            id: '2',
            imgSrc:
              'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Rome, Italy',
            description:
              'Step into the Eternal City — explore ancient ruins, vibrant piazzas, and world-famous cuisine. From the Colosseum to hidden trattorias, Rome is where history and modern life meet.',
          },
          {
            id: '3',
            imgSrc:
              'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Rome, Italy',
            description:
              'Step into the Eternal City — explore ancient ruins, vibrant piazzas, and world-famous cuisine. From the Colosseum to hidden trattorias, Rome is where history and modern life meet.',
          },
          {
            id: '4',
            imgSrc:
              'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Rome, Italy',
            description:
              'Step into the Eternal City — explore ancient ruins, vibrant piazzas, and world-famous cuisine. From the Colosseum to hidden trattorias, Rome is where history and modern life meet.',
          },
          {
            id: '5',
            imgSrc:
              'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Rome, Italy',
            description:
              'Step into the Eternal City — explore ancient ruins, vibrant piazzas, and world-famous cuisine. From the Colosseum to hidden trattorias, Rome is where history and modern life meet.',
          },
        ]}
      />

      <div>form</div>
    </main>
  );
}
