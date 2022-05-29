import { default as Link } from "next/link";

export default function HomePage() {    
    return (
        <>
            <div className="continuous-hero-background relative">
                <HeroSection />

                <style jsx>{`
                    .continuous-hero-background {
                        background: linear-gradient(to bottom, rgb(0 0 0 / 0.6), rgb(0 0 0));
                    }

                    .continuous-hero-background::before {
                        content: '';
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: -1;
                        background-image: url("/ppks-sample-bg-image.png");
                        background-size: cover;
                    }
                `}</style>
            </div>
        </>
    )
}

function HeroSection() {
    return (
        <section className="flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl text-white font-bold mb-6 tracking-tight">
                Lorem Ipsum
            </h1>

            <p className="text-2xl text-white font-light tracking-tight mb-10">
                Lorem ipsum adalah tempat untuk lorem ipsum (placeholder text).
            </p>

            <div className="flex items-center">
                <span className="text-white mr-2">Pernah mengalami sesuatu?</span>
                <Link href="/akun/masuk">
                    <a className={
                        "button bg-white text-gray-800"
                    }>
                        Do something &rarr;
                    </a>
                </Link>
            </div>

            

            <style jsx>{`
                section {
                    min-height: calc(calc(100vh - var(--page-header-height)) - 10rem);
                }
            `}</style>
        </section>
    );
}

// export const getStaticProps: GetStaticProps<{
//     stories: StoryItem[];
//     news: EntryCollection<News>;
// }> = async () => {
//     const stories = await query<StoryItem>("SELECT * FROM stories ORDER BY last_updated DESC LIMIT 4");
//     const news = await contentfulClient.getEntries<News>({
//         content_type: "berita",
//         limit: 4
//     });

//     return {
//         props: {
//             stories: toSerializableObject(stories),
//             news
//         }
//     };
// }