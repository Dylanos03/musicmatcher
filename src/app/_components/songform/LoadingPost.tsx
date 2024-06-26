import LoadingDots from "../LoadingDots";

function LoadingPost() {
  return (
    <section className="absolute left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold italic">Sharing your song!</h1>
      <LoadingDots />
    </section>
  );
}

export default LoadingPost;
