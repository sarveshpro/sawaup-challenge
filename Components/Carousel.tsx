import { Box, IconButton, Modal, Typography } from '@mui/material'
import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactPlayer from 'react-player';
import { Favorite } from '@mui/icons-material';

type Props = {
    courses: Sawaup.Course[],
    favouriteCourseIds: number[],
    setFavoriteCourseIds: React.Dispatch<React.SetStateAction<number[]>>
}

export default function Carousel({
    courses,
    favouriteCourseIds,
    setFavoriteCourseIds
}: Props) {

    // states for mobile view, modal open, video url
    const [isMobile, setIsMobile] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [videoUrl, setVideoUrl] = React.useState('');

    // check if mobile view
    React.useEffect(() => {
        setIsMobile(window.innerWidth < 600);
    }, []);

    // handle video click
    const handleVideoClick = (url: string) => {
        setVideoUrl(url);
        setOpen(true);
    }

    // handle modal close
    const handleModalClose = () => {
        setVideoUrl('');
        setOpen(false);
    }

    // handle favourite click
    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, courseId: number) => {
        e.stopPropagation(); // prevent video click
        // if course is favourite, remove from favourite list
        if (favouriteCourseIds.includes(courseId)) {
            setFavoriteCourseIds(favouriteCourseIds.filter((id) => id !== courseId));
        } else {
            // else add to favourite list
            setFavoriteCourseIds([...favouriteCourseIds, courseId]);
        }
    }

    // check if course is favourite
    const isFavorite = (courseId: number) => {
        return favouriteCourseIds.includes(courseId);
    }

    // settings for carousel
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
                            <IconButton onClick={(e) => handleFavoriteClick(e, course.id)} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                                {isFavorite(course.id) ? <Favorite color="error" /> : <Favorite color="disabled" />}
                            </IconButton>
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