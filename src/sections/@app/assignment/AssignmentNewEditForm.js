import PropTypes from "prop-types";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { Card, Grid, Stack, Typography } from "@mui/material";
import { PATH_APP } from "../../../routes/paths";
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFTextField,
  RHFUploadMultiFile,
} from "../../../components/hook-form";
import RHFDatePicker from "../../../components/hook-form/RHFDatePicker";
import { useMutation, useQuery } from "@apollo/client";
import { UPSERTASSIGNMENT_MUTATION } from "../../../utils/graphql-mutation";
import {
  ALLASSIGNMENT_QUERY,
  ALLCOURSE_NAME_QUERY,
} from "../../../utils/graphql-query";
import LoadingScreen from "../../../components/LoadingScreen";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

AssignmentNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  assignment: PropTypes.object,
};

export default function AssignmentNewEditForm({ isEdit = false, assignment }) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { loading, data, error } = useQuery(ALLCOURSE_NAME_QUERY);

  const NewAssignmentSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    attachments: Yup.array(),
    dueDate: Yup.date().required("Due date is required"),
    course: Yup.number().required("Course is required"),
  });

  const defaultValues = useMemo(
    () => ({
      name: assignment?.name || "",
      description: assignment?.description || "",
      attachments: assignment?.attachments || [],
      dueDate: assignment?.dueDate || "",
      course: assignment?.course.id || "",
    }),
    [assignment]
  );

  const methods = useForm({
    resolver: yupResolver(NewAssignmentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && assignment) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, assignment, reset, defaultValues]);

  const [upsertAssignment] = useMutation(UPSERTASSIGNMENT_MUTATION, {
    refetchQueries: [
      {
        query: ALLASSIGNMENT_QUERY,
      },
    ],
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const attachments = data.attachments.map((attachment) => {
        return {
          name: attachment.name,
          size: attachment.size,
          extension: attachment.extension,
          attachmentBase64: attachment.attachmentBase64,
        };
      });
      await upsertAssignment({
        variables: {
          assignmentInput: {
            id: isEdit ? assignment.id : 0,
            name: data.name,
            description: data.description,
            dueDate: data.dueDate,
            courseId: data.course,
            attachments: attachments,
          },
        },
      });
      reset();
      enqueueSnackbar(!isEdit ? "Create success!" : "Update success!");
      push(PATH_APP.assignment.all);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      try {
        console.log(getValues("attachments"));
        console.log(acceptedFiles);

        const prs = acceptedFiles.map((element) => toBase64(element));
        const base64Files = await Promise.all(prs);
        console.log(base64Files);

        setValue("attachments", [...getValues("attachments"), ...base64Files]);
      } catch (error) {
        console.error("Error handling drop: ", error);
      }
    },
    [getValues, setValue]
  );

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({
          name: file.name,
          extension: file.type,
          size: file.size.toString(),
          attachmentBase64: reader.result,
        });
      reader.onerror = (error) => reject(error);
    });

  const handleRemoveAll = () => {
    setValue("attachments", []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.attachments?.filter((_file) => _file !== file);
    setValue("attachments", filteredItems);
  };

  const handleUploadAll = (file) => {
    setValue("attachments", [file.name]);
  };

  if (loading) return <LoadingScreen />;
  const course = data.allCourse;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField
                disabled={isEdit}
                name="name"
                label="Assignment Name"
              />

              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>

              <div>
                <LabelStyle>Attachments</LabelStyle>
                <RHFUploadMultiFile
                  name="attachments"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  onUploadAll={handleUploadAll}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFSelect
                  disabled={isEdit}
                  name="course"
                  label="Course"
                  placeholder="Course"
                >
                  <option value="" />
                  {course.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>

                <RHFDatePicker
                  name="dueDate"
                  label="Due Date"
                  minDate={Date.now()}
                />
              </Stack>
            </Card>

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
            >
              {!isEdit ? "Create Assignment" : "Save Changes"}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
