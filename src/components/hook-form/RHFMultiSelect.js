import PropTypes from 'prop-types';
import {Controller, useFormContext} from 'react-hook-form';
import {Autocomplete, Chip, TextField} from '@mui/material';
import {fFullName} from "../../utils/formatName";

RHFMultiSelect.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired
};

export default function RHFMultiSelect({ name, label, options, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: {error} }) => (
                <Autocomplete
                    {...field}
                    multiple
                    disableCloseOnSelect
                    options={options}
                    getOptionLabel={option => option.name ? option.name : fFullName(option.firstName, option.lastName)}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option.id} size="small"
                                  label={option.name ? option.name : fFullName(option.firstName, option.lastName)} />
                        ))
                    }
                    renderInput={(params) =>
                        <TextField label={label}
                                   error={!!error}
                                   helperText={error?.message}
                                   {...params} />
                    }
                    {...other}
                />
            )}
        />
    );
}
