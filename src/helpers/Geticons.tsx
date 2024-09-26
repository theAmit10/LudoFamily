import { Colors } from "../constrants/Colors";

interface Image{
    name: string | number;
    image: any;
}

export class BackgroundImage {
    private static images: Array<Image> = [
        {
            name: Colors.green,
            image: require("../assets/images/piles/green.png")
        },
        {
            name: Colors.red,
            image: require("../assets/images/piles/red.png")
        },
        {
            name: Colors.yellow,
            image: require("../assets/images/piles/yellow.png")
        },
        {
            name: Colors.blue,
            image: require("../assets/images/piles/blue.png")
        },
    ]

    static GetImage = (name : string) => {
        const found = BackgroundImage.images.find( e => e.name === name);
        return found ? found.image : null;
    }
}