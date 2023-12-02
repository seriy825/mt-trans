export const SELECT_STYLE_CONFIG = (errorMessage, error) =>{
    return {
        input: (base) => ({
            ...base,
            '&::placeholder': {
                color: errorMessage || error ? '#ED4343' : 'inherit'
            }
        }),
        container: (base) => ({
            ...base,
        }),
        singleValue: (base) => ({
            ...base,
            paddingLeft: 2,
            color: errorMessage || error ? '#ED4343' : '#727BB5',
        }),
        valueContainer: (base) => ({
            ...base,
            paddingTop: 5.5,
            paddingBottom: 5.5,
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            display: state.isDisabled ? 'none' : 'block'
        }),
        control: (base, state) => ({
            ...base,
            fontSize: 14,
            borderRadius: 6,
            backgroundColor: state.isDisabled ? 'inherit' : '#FAFAFF',
            border: errorMessage || error ? '1px solid #ED4343' : 'none',
            "&:hover": {
                borderColor: "rgba(114, 118, 117, 0.4)",
            },
            boxShadow: "none",
            cursor: state.isDisabled ? 'text' : 'pointer',
        }),
        option: (base) => ({
            ...base,
            backgroundColor: "#fff",
            paddingLeft: 15,
            paddingRight: 15,
            color: '#000',
            cursor: 'pointer',
            "&:hover": {
                backgroundColor: "#E9ECFE",
                transition: 'background-color .3s ease-out'
            },
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: 200,
            fontSize: 14,
            border: 'none',
            boxShadow: '0px 8px 15px 0px rgba(0, 0, 0, 0.10)'
        }),
        placeholder: (base) => ({
            ...base,
            paddingLeft: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            opacity: errorMessage || error ? 1 : 0.3,
            color: errorMessage || error ? '#ED4343' : '#727BB5'
        })
    }
}