import PropTypes from 'prop-types';
import {Card, Divider, Stack} from '@mui/material';
import Scrollbar from "../../../components/Scrollbar";
import sumBy from "lodash/sumBy";
import {useTheme} from "@mui/material/styles";

AssignmentAnalyticDetails.propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.string,
    percent: PropTypes.number,
    total: PropTypes.number,
};

export default function AssignmentAnalyticDetails({ title, total, icon, color, percent }) {
    const theme = useTheme();

    return (
        <Card sx={{ mb: 5 }}>
            <Scrollbar>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                    sx={{ py: 2 }}
                >
                    <AssignmentAnalyticDetails
                        title="Total"
                        total={tableData.length}
                        percent={100}
                        price={sumBy(tableData, 'totalPrice')}
                        icon="ic:round-receipt"
                        color={theme.palette.info.main}
                    />
                    <AssignmentAnalyticDetails
                        title="Paid"
                        total={getLengthByStatus('paid')}
                        percent={getPercentByStatus('paid')}
                        price={getTotalPriceByStatus('paid')}
                        icon="eva:checkmark-circle-2-fill"
                        color={theme.palette.success.main}
                    />
                    <AssignmentAnalyticDetails
                        title="Unpaid"
                        total={getLengthByStatus('unpaid')}
                        percent={getPercentByStatus('unpaid')}
                        price={getTotalPriceByStatus('unpaid')}
                        icon="eva:clock-fill"
                        color={theme.palette.warning.main}
                    />
                    <AssignmentAnalyticDetails
                        title="Overdue"
                        total={getLengthByStatus('overdue')}
                        percent={getPercentByStatus('overdue')}
                        price={getTotalPriceByStatus('overdue')}
                        icon="eva:bell-fill"
                        color={theme.palette.error.main}
                    />
                    <AssignmentAnalyticDetails
                        title="Draft"
                        total={getLengthByStatus('draft')}
                        percent={getPercentByStatus('draft')}
                        price={getTotalPriceByStatus('draft')}
                        icon="eva:file-fill"
                        color={theme.palette.text.secondary}
                    />
                </Stack>
            </Scrollbar>
        </Card>
    );
}
