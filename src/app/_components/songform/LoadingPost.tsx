function LoadingPost() {
  return (
    <section className="absolute left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold italic">Sharing your song!</h1>
      <div className="flex items-center justify-center space-x-2  ">
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground"></div>
      </div>
    </section>
  );
}

export default LoadingPost;
