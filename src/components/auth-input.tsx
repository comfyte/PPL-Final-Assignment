type TextInputGroupProps = {
    type: "text" | "password" | "number",
    inputRef?: any,
    disabled?: boolean,
    value?: string,
    defaultValue?: string,
    [propName: string]: any
}

function TextInputGroup({
    name,
    type = "text",
    title,
    inputRef,
    invalid,
    helperMessage,
    value,
    disabled,
    required,
    onChange,
    ...inputProps
}: TextInputGroupProps) {
    return (
        <div>
            <label htmlFor={name} className={`block opacity-70 mb-0.5${/*invalid ? " text-red-500" : */''}`}>{title}</label>
            <input
                type={type}
                name={name}
                className={`w-80${invalid ? " border-red-400 hover:border-red-500 focus:border-red-500" : ''}`}
                ref={inputRef}
                disabled={disabled}
                required={required}
                value={value}
                onChange={onChange}
                {...inputProps}
            />
            {helperMessage && <p className="helper-message text-xs mt-1 overflow-hidden">{helperMessage}</p>}

            <style jsx>{`
                div:focus-within > label {
                    opacity: 1;
                }

                div + div {
                    margin-top: 1rem;
                }

                .helper-message {
                    animation: helper-message-appear 0.2s;
                }

                @keyframes helper-message-appear/*ing*/ {
                    from {
                        max-height: 0;
                    }
                    to {
                        max-height: 1rem;
                    }
                }
            `}</style>
        </div>
    )
}

export default TextInputGroup;