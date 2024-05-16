import PropTypes from 'prop-types';
import {Controller, useFormContext} from 'react-hook-form';
import {TextField} from '@mui/material';
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import { parseISO } from 'date-fns';

RHFDatePicker.propTypes = {
    name: PropTypes.string,
};

export default function RHFDatePicker({name, ...other}) {
    const {control} = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState: {error}}) => (
                <DatePicker
                    id={name}
                    value={field.value ? parseISO(field.value): null}
                    onChange={(newValue) => {
                        field.onChange(newValue);
                    }}
                    textField={(params) => (
                        <TextField {...params} fullWidth error={!!error} helperText={error?.message || ''} />
                    )}
                    inputFormat="dd-MM-yyyy"
                    {...other}
                />
            )}
        />
    );
}
