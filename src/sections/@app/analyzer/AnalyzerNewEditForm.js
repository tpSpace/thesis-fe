import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {useCallback, useEffect, useMemo} from 'react';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {styled} from '@mui/material/styles';
import {LoadingButton} from '@mui/lab';
import {Card, Grid, Stack, Typography} from '@mui/material';
import {PATH_APP} from '../../../routes/paths';
import {FormProvider, RHFEditor, RHFTextField, RHFUploadSingleFile,} from '../../../components/hook-form';
import {useMutation} from "@apollo/client";
import {UPSERTANALYZER_MUTATION} from "../../../utils/graphql-mutation";
import {ALLANALYZER_QUERY} from "../../../utils/graphql-query";

const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

AnalyzerNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    analyzer: PropTypes.object,
};

export default function AnalyzerNewEditForm({ isEdit, analyzer }) {
    const { push } = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const NewAnalyzerSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        attachment: Yup.object(),
    });

    const defaultValues = useMemo(
        () => ({
            name: analyzer?.name || '',
            description: analyzer?.description || '',
            attachment: analyzer?.attachment || null,
        }),
        [analyzer]
    )

    const methods = useForm({
        resolver: yupResolver(NewAnalyzerSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && analyzer) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, analyzer]);

    const [upsertAnalyzer] = useMutation(UPSERTANALYZER_MUTATION, {
        refetchQueries: [
            {
                query: ALLANALYZER_QUERY
            }
        ]
    });

    const onSubmit = async (data) => {
        try {
            console.log(data);
            const {attachment} = data;
            console.log(isEdit ? analyzer.id : 0);
            await upsertAnalyzer({
                variables: {
                    analyzerInput: {
                        id: isEdit ? analyzer.id : 0,
                        name: data.name,
                        description: data.description,
                        analyzerBase64: attachment.attachmentBase64,
                        analyzerFileName: attachment.name,
                        analyzerFileExtension: attachment.extension,
                        analyzerFileSize: attachment.size,
                    }
                },
                errorPolicy: 'none'
            });
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            push(PATH_APP.analyzer.all);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            console.error(error);
        }
    };

    const handleDrop = useCallback(
        async (acceptedFile) => {
            const base64File = await toBase64(acceptedFile);
            setValue('attachment', base64File);
        },
        [setValue]
    );

    const toBase64 = (files) => new Promise((resolve, reject) => {
        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({
            name: file.name,
            extension: file.type,
            size: file.size.toString(),
            attachmentBase64: reader.result
        });
        reader.onerror = error => reject(error);
    });

    const handleRemove = () => {
        setValue('attachment', null);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <RHFTextField disabled={isEdit} name="name" label="Analyzer Name" />

                            <div>
                                <LabelStyle>Description</LabelStyle>
                                <RHFEditor simple name="description" />
                            </div>

                            <div>
                                <LabelStyle>Attachment</LabelStyle>
                                <RHFUploadSingleFile
                                    accept="application/java-archive"
                                    name="attachment"
                                    maxSize={3145728}
                                    onDrop={handleDrop}
                                    onRemove={handleRemove}
                                />
                            </div>
                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                            {!isEdit ? 'Create Analyzer' : 'Save Changes'}
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
