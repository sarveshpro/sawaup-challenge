import { Box, Modal, Typography } from '@mui/material'
import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactPlayer from 'react-player';

type Props = {
    courses: Sawaup.Course[]
}

// React component to display a carousel of courses, 3 at a time, with arrows to scroll and use Material UI components
export default function Carousel({
    courses
}: Props) {
    const [isMobile, setIsMobile] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [videoUrl, setVideoUrl] = React.useState('');

    React.useEffect(() => {
        setIsMobile(window.innerWidth < 600);
    }, []);

    const handleVideoClick = (url: string) => {
        setVideoUrl(url);
        setOpen(true);
    }

    const handleModalClose = () => {
        setVideoUrl('');
        setOpen(false);
    }

    const settings = {
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true,
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Slider
                {...settings}
                slidesToShow={isMobile ? 1 : 3}
            >
                {courses.map((course) => (
                    <Box key={course.id} className="courseCard" onClick={() => handleVideoClick(course.url)}>
                        <Box className="content">
                            <Typography variant="h6" component="div">
                                {course.name}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Slider>
            <Modal
                open={open}
                onClose={handleModalClose}

            >
                <div className='modal'>
                    <ReactPlayer url={videoUrl} width="100%" height="400px" />
                </div>
            </Modal>
        </Box>
    )
}