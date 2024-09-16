import { twMerge } from "tailwind-merge";

type InvisibleInputProps = {
    value: string;
    setValue: (value: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InvisibleInput({ value, setValue, ...rest }: InvisibleInputProps) {
    return (
        <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            {...rest}
            className={twMerge(`px-2 py-1.5 w-full my-3 rounded-md flex-1 text-base dark:text-gray-300 border-none bg-transparent outline-none focus:bg-white focus:shadow transition-all duration-300 ease-in-out`, rest.className)}
        />
    )
}