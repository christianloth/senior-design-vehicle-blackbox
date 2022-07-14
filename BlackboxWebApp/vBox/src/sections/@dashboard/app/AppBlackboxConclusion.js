import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
// material
import {Box, Stack, Link, Card, Divider, Typography, CardHeader} from '@mui/material';
// utils
//
import Scrollbar from '../../../components/Scrollbar';



NewsItem.propTypes = {
    news: PropTypes.object.isRequired
};

function NewsItem({news}) {
    const {image, title, description} = news;

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box
                component="img"
                alt={title}
                src={image}
                sx={{width: 48, height: 48, borderRadius: 1.5}}
            />
            <Box sx={{minWidth: 240}}>
                <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {title}
                    </Typography>
                </Link>
                <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                    {description}
                </Typography>
            </Box>
        </Stack>
    );
}

export default function AppBlackboxConclusion(params) {

    // ----------------------------------------------------------------------

    const NEWS = [...Array(5)].map((_, index) => {
        const setIndex = index + 1;

        const titles = ["1", "2", "3", "4", "5"];
        const descriptions = [params.conclusion_1, params.conclusion_2, params.conclusion_3, params.conclusion_4, params.conclusion_5];
        return {
            title: titles[setIndex - 1],
            description: descriptions[setIndex - 1],
            image: `/static/mock-images/covers/cover_1.jpg`,
        };
    });

    // ----------------------------------------------------------------------

    return (
        <Card>
            <CardHeader
                title="Blackbox Conclusion"
                subheader="Here is the conclusion about the driver."/>

            <Scrollbar>
                <Stack spacing={3} sx={{p: 3, pr: 0}}>
                    {NEWS.map((news) => (
                        <NewsItem key={news.title} news={news}/>
                    ))}
                </Stack>
            </Scrollbar>

            <Divider/>

        </Card>
    );
}
