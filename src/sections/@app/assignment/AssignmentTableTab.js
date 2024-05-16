import {Stack, Tab, Tabs} from '@mui/material';
import {useFormContext} from "react-hook-form";
import Label from "../../../components/Label";


export default function AssignmentTableTab() {
    const {control} = useFormContext();

    return (
        <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filters.status}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
        >
            {TABS.map((tab) => (
                <Tab
                    disableRipple
                    key={tab.value}
                    value={tab.value}
                    label={
                        <Stack spacing={1} direction="row" alignItems="center">
                            <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                        </Stack>
                    }
                />
            ))}
        </Tabs>
    );
}
