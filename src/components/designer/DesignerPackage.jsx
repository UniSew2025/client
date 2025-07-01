import React, {useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const initialPlans = [
    {
        title: 'Basic Plan',
        price: 50000,
        desc: 'Basic package',
        features: [
            'Intro video the course',
            'Interactive quizes',
            'Course curriculum',
            'Community supports',
            'Certificate of completion',
            'Sample lesson showcasing',
            'Access to course community',
        ],
        highlight: false,
        enabled: true,
    },
    {
        title: 'Standard Plan',
        price: 129000,
        desc: 'Standard package',
        features: [
            'Intro video the course',
            'Interactive quizes',
            'Course curriculum',
            'Community supports',
            'Certificate of completion',
            'Sample lesson showcasing',
            'Access to course community',
        ],
        highlight: false,
        enabled: true,
    },
    {
        title: 'Premium Plan',
        price: 280000,
        desc: 'Expert package',
        features: [
            'Intro video the course',
            'Interactive quizes',
            'Course curriculum',
            'Community supports',
            'Certificate of completion',
            'Sample lesson showcasing',
            'Access to course community',
        ],
        highlight: false,
        enabled: false,
    },
];


function PlanCard({plan, onToggleEnable}) {

    const formatVND = (price) =>
        new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price);

    return (
        <Card
            sx={{
                position: 'relative',
                minHeight: 490,
                transition: '0.2s',
                opacity: plan.enabled ? 1 : 0.5,
            }}
        >
            <CardContent>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'space-between'}}>
                    <Typography variant="h6" fontWeight="bold">{plan.title}</Typography>
                    <Switch
                        checked={plan.enabled}
                        color="primary"
                        onChange={onToggleEnable}
                        inputProps={{'aria-label': 'Enable/Disable Plan'}}
                    />
                </Box>
                <Typography color="text.secondary" mb={2}>{plan.desc}</Typography>
                <Typography variant="h3" fontWeight="bold" color="primary" mb={1} lineHeight={1.1}>
                    {formatVND(plan.price)}
                </Typography>
                <Box mt={3} mb={3}>
                    <List dense>
                        {plan.features.map((feat) => (
                            <ListItem key={feat} sx={{py: 0.5}}>
                                <ListItemIcon sx={{minWidth: 32}}>
                                    <CheckCircleIcon color="primary" fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText primary={feat}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Button
                    fullWidth
                    variant={plan.highlight ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    sx={{mt: 2, borderRadius: 6, fontWeight: 'bold'}}
                >
                    Edit Plan
                </Button>
            </CardContent>
        </Card>
    );
}

function PlanList({plans, onTogglePlanEnable}) {
    return (
        <Grid container spacing={7}>
            {plans.map((plan, index) => (
                <Grid minWidth={"350px"} item xs={12} md={4} key={plan.title}>
                    <PlanCard plan={plan} onToggleEnable={() => onTogglePlanEnable(index)}/>
                </Grid>
            ))}
        </Grid>
    );
}

function TermsAndPolicy() {
    return (
        <Box mt={4} pl={1}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Terms & Policy</Typography>
            <Typography component="ul" color="text.secondary" sx={{pl: 3}}>
                <li>Set up multiple pricing levels with different features and functionalities to maximize revenue</li>
                <li>Continuously test different price points and discounts to find the sweet spot that resonates with
                    your target audience
                </li>
                <li>Price your course based on the perceived value it provides to students, considering factors</li>
            </Typography>
        </Box>
    );
}

export default function DesignerPackage() {
    const [plans, setPlans] = useState(initialPlans);

    // Xử lý bật/tắt enable cho từng plan
    const handleTogglePlanEnable = (idx) => {
        setPlans(prev =>
            prev.map((plan, i) =>
                i === idx ? {...plan, enabled: !plan.enabled} : plan
            )
        );
    };

    return (
        <Box sx={{minHeight: '90vh', py: 4}}>
            <Box sx={{maxWidth: 1200, mx: 'auto', p: 2}}>
                <Typography variant="h5" fontWeight="bold" mb={1}>
                    Pricing Breakdown
                </Typography>
                <Typography color="text.secondary" mb={3}>
                    Creating a detailed pricing plan for your course requires considering various factors.
                </Typography>

                <PlanList plans={plans} onTogglePlanEnable={handleTogglePlanEnable}/>

                <TermsAndPolicy/>
            </Box>
        </Box>
    );
}
