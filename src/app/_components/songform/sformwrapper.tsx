type FormWrapperProps = {
  title: string;
  children: React.ReactNode;
  amount: number;
};

export function SFormWrapper({ title, children, amount }: FormWrapperProps) {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="p-4 italic">
        select <span>{amount}</span>
      </p>
      {children}
    </div>
  );
}
