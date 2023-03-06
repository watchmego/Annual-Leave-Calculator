import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { addDays, subDays, differenceInBusinessDays } from 'date-fns'
import {enNZ} from 'date-fns/locale';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

function App() {

  const date = new Date();
  const formFields = {
    alBalance: 0,
    additionalDays: 0,
    alPerYear: 20,
    start: date,
    end: addDays(date, 1),
    alBooked: 0,
    currentALBalance: 0,
    futureALBalance: 0,
    daysRequired: 0,
    daysLeft: 0,
  };

  const { control, getValues, setValue } = useForm({
    values: formFields,
    mode: 'onChange'
  });


  const calculate = (value, field) => {
    //set new value
    if(field) {
      setValue(field, value);
    }
    //ensure end is later than start
    if((field === 'start' || field === 'end') && getValues('end') <= getValues('start')) {
      if(field === 'start') {
        setValue('end', addDays(value, 1));
      } else {
        setValue('start', subDays(value, 1))
      }
    }
    console.log(getValues('end'))
  
    const currentALBalance = Number(getValues('alBalance')) + Number(getValues('additionalDays')) - Number(getValues('alBooked'));
    //number of leave days earned per business day
    const businessDays = differenceInBusinessDays(addDays(date, 365), date);
    //number of days earned between now and first day of holiday
    const aLGained = differenceInBusinessDays(Number(getValues('start')), date) / businessDays * 20;
    //set number of days required for holiday
    setValue('daysRequired', differenceInBusinessDays(Number(getValues('end')), Number(getValues('start'))));
    //set future leave balance
    setValue('futureALBalance', currentALBalance + aLGained);
    //number of days left once leave has been taken
    setValue('daysLeft', Number((getValues('futureALBalance')) - Number(getValues('daysRequired'))));
  }


  return (
    <div>
      <h1>Annual Leave Calculator</h1>
        <Container maxWidth="sm" sx={{ py: 6}}>
          <Stack component="form" noValidate spacing={3}>
            <Controller
              name="alBalance"
              control={control}
              //rules={validationRules.name}
              render={({ field, fieldState }) => (
                  <TextField
                      {...field}  
                      onChange={((evt) => {
                        calculate(evt.target.value, "alBalance");
                      })}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]'}}                         
                      fullwidthtype="text"
                      label="Current Annual Leave"
                      error={fieldState.error?.message}
                      helperText={fieldState.error?.message}
                  />
              )}

            />
            <Controller
              name="alPerYear"
              control={control}
              //rules={validationRules.name}
              render={({ field, fieldState }) => (
                  <TextField
                      {...field}
                      onChange={((evt) => {
                        calculate(evt.target.value, "alPerYear");
                      })}   
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]'}}                         
                      fullwidthtype="text"
                      label="Holidays per year"
                      error={fieldState.error?.message}
                      helperText={fieldState.error?.message}
                  />
              )}

            />            
            <Controller
            name="alBooked"
            control={control}
            //rules={validationRules.name}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    onChange={((evt) => {
                      calculate(evt.target.value, "alBooked");
                    })}      
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]'}}                         
                    fullwidthtype="text"
                    label="Number of AL days already booked"
                    error={fieldState.error?.message}
                    helperText={fieldState.error?.message}
                />
            )}
            />            
            <Controller
            name="currentALBalance"
            control={control}
            //rules={validationRules.name}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}  
                    onChange={((evt) => {
                      calculate(evt.target.value, "currentALBalance");
                    })}     
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]'}}                         
                    fullwidthtype="text"
                    label="Current Balance"
                    error={fieldState.error?.message}
                    helperText={fieldState.error?.message}
                />
            )}
            />
            
            <Controller
              name="start"
              control={control}
              //rules={validationRules.start}
              render={({ field, fieldState }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enNZ}>
                  <DatePicker
                      {...field}
                      label="Start Date of Holiday"
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                      <TextField
                          {...params}
                          error={!!fieldState.error?.message}
                          helperText={fieldState.error?.message}
                      />
                      )}
                      // Validation is not fired with the default react-hook-form mode. So you need this custom onChange event handling.
                      onChange={(date) => 
                          {
                            calculate(date, 'start');
                          } 
                      }
                  />
                </LocalizationProvider>
              )}
            />
            <Controller
              name="end"
              control={control}
              //rules={validationRules.start}
              render={({ field, fieldState }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enNZ}>
                  <DatePicker
                      {...field}
                      label="End Date of Holiday"
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => (
                      <TextField
                          {...params}
                          error={!!fieldState.error?.message}
                          helperText={fieldState.error?.message}
                      />
                      )}
                      // Validation is not fired with the default react-hook-form mode. So you need this custom onChange event handling.
                      onChange={(date) => 
                        {
                          calculate(date, 'end');
                        } 
                    }
                  />
                </LocalizationProvider>
              )}
            />
            <Controller
              name="futureALBalance"
              control={control}
              //rules={validationRules.name}
              render={({ field, fieldState, onChange }) => (
                  <TextField
                      {...field}   
                      disabled
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]'}}                         
                      fullwidthtype="text"
                      label="future leave balance"
                      error={fieldState.error?.message}
                      helperText={fieldState.error?.message}
                  />
              )}
            />
            <Controller
              name="daysRequired"
              control={control}
              //rules={validationRules.name}
              render={({ field, fieldState }) => (
                  <TextField
                      {...field}   
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]'}}                         
                      fullwidthtype="text"
                      label="Number of AL days required"
                      error={fieldState.error?.message}
                      helperText={fieldState.error?.message}
                  />
              )}
            />      
            <Controller
              name="daysLeft"
              control={control}
              //rules={validationRules.name}
              render={({ field, fieldState }) => (
                  <TextField
                      {...field}   
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]'}}                         
                      fullwidthtype="text"
                      label="days left after booking"
                      error={fieldState.error?.message}
                      helperText={fieldState.error?.message}
                  />
              )}

            />
          </Stack>
      </Container>
    </div>

  );
}

export default App;
