class Vishnu {
    constructor(parameters) {
        this.config = parameters;
    }
    config = {
        backend : undefined,
        returnlink : undefined,
    }
    getLink = async () => {
        if(!this.config.backend){
            throw new Error("Service backend endpoint has not been configured");
        }
        try {
            const data = await fetch(this.config.backend);
            const response = await data.json();

            if(!response.service_token || !response.return_link){
                throw new Error("Backend endpoint did not return details");
            }
            return `https://vishnu.writeroo.in/auth?st=${response.service_token}&rlink=${this.config.returnlink || response.return_link}`;
        } catch (error) {
            throw new Error("Cannot reach backend");
        }
    }
}