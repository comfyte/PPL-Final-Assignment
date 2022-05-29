module.exports = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    // options: {
                    //     svgoConfig: {
                    //         plugins: [
                    //             { removeViewBox: false }
                    //         ]
                    //     }
                    // }
                }
            ]
        });

        return config;
    }
}