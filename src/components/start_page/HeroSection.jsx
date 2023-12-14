import {Button} from './Button';
import 'HeroSection.css';
function HeroSection() {

    return (
        <div className='hero-container'>
            <h1>ADVENTURE AWAIT</h1>
            <p>What are you waiting for?</p>
            <div className='hero-btn'>
                <Button
                    buttonStyle='btn--outline'
                    buttonSize='btn--large'
                >
                    GET STARTED
                </Button>
            </div>
        </div>


    )
} export default HeroSection;