type FormWrapperProps = {
  title: string;
  children: React.ReactNode;
};

export function SFormWrapper({ title, children }: FormWrapperProps) {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>

      {children}
    </div>
  );
}
