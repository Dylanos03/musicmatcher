function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-2  ">
      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground"></div>
    </div>
  );
}

export default LoadingDots;
