type FormWrapperProps = {
  title: string;
  children: React.ReactNode;
  amount: number;
};

export function FormWrapper({ title, children, amount }: FormWrapperProps) {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="p-4 italic">
        select up to <span>{amount}</span>
      </p>
      {children}
    </div>
  );
}
