import React from 'react';
import { useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { tokens } from '../theme';
import './MatchNotification.css'; // Create or update this CSS file for custom styles

const FoodSource = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div className="food-source-page">
            
            <Box
                gridColumn="span 3"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gridAutoRows="140px"
                    gap="20px"
                >
                    {/* ROW 1 */}
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* Content for the first box */}
                        
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default FoodSource;