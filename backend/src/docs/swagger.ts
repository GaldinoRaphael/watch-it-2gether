import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Watch It 2Gether API",
            version: "1.0.0",
            description: "API documentation for Watch It 2Gether",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server",
            },
        ],
        components: {
            schemas: {
                Group: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "1d0b7a3c-8f91-4f4a-a1d3-52ef8d312345",
                        },
                        name: {
                            type: "string",
                            example: "Cinema de Sexta",
                        },
                        ownerId: {
                            type: "string",
                            example: "f6f0f8db-cd54-45cf-b0fb-25bc9a7d1234",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-04-07T20:15:00.000Z",
                        },
                    },
                },
                CreateGroupInput: {
                    type: "object",
                    required: ["name", "ownerId"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Cinema de Sexta",
                        },
                        ownerId: {
                            type: "string",
                            example: "f6f0f8db-cd54-45cf-b0fb-25bc9a7d1234",
                        },
                    },
                },
                UpdateGroupInput: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "Cinema de Sábado",
                        },
                        ownerId: {
                            type: "string",
                            example: "f6f0f8db-cd54-45cf-b0fb-25bc9a7d1234",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-04-07T20:15:00.000Z",
                        },
                    },
                },
                Movie: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "7a4fd5c1-6f63-4b59-b3e5-6a0fa41a1234",
                        },
                        externalId: {
                            type: "string",
                            example: "tt0111161",
                        },
                        title: {
                            type: "string",
                            example: "The Shawshank Redemption",
                        },
                        year: {
                            type: "string",
                            example: "1994",
                        },
                        posterUrl: {
                            type: "string",
                            nullable: true,
                            example: "https://image.tmdb.org/t/p/w500/poster.jpg",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-04-07T20:15:00.000Z",
                        },
                    },
                },
                CreateMovieInput: {
                    type: "object",
                    required: ["externalId", "title", "year"],
                    properties: {
                        externalId: {
                            type: "string",
                            example: "tt0111161",
                        },
                        title: {
                            type: "string",
                            example: "The Shawshank Redemption",
                        },
                        year: {
                            type: "string",
                            example: "1994",
                        },
                        posterUrl: {
                            type: "string",
                            example: "https://image.tmdb.org/t/p/w500/poster.jpg",
                        },
                    },
                },
                UpdateMovieInput: {
                    type: "object",
                    properties: {
                        externalId: {
                            type: "string",
                            example: "tt0111161",
                        },
                        title: {
                            type: "string",
                            example: "The Shawshank Redemption",
                        },
                        year: {
                            type: "string",
                            example: "1994",
                        },
                        posterUrl: {
                            type: "string",
                            example: "https://image.tmdb.org/t/p/w500/poster.jpg",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-04-07T20:15:00.000Z",
                        },
                    },
                },
                ImdbMovie: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "tt0111161",
                        },
                        type: {
                            type: "string",
                            example: "movie",
                        },
                        primaryTitle: {
                            type: "string",
                            example: "The Shawshank Redemption",
                        },
                        originalTitle: {
                            type: "string",
                            example: "The Shawshank Redemption",
                        },
                        startYear: {
                            type: "number",
                            example: 1994,
                        },
                        plot: {
                            type: "string",
                            example: "Two imprisoned men bond over a number of years.",
                        },
                        primaryImage: {
                            type: "object",
                            properties: {
                                url: {
                                    type: "string",
                                    example: "https://image.tmdb.org/t/p/w500/poster.jpg",
                                },
                                width: {
                                    type: "number",
                                    example: 1000,
                                },
                                height: {
                                    type: "number",
                                    example: 1500,
                                },
                            },
                        },
                    },
                },
                Vote: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "9b2fd3b5-2c84-4f61-91d1-3fbac9ff1234",
                        },
                        userId: {
                            type: "string",
                            example: "user-123",
                        },
                        groupId: {
                            type: "string",
                            example: "group-123",
                        },
                        movieId: {
                            type: "string",
                            example: "movie-123",
                        },
                        rating: {
                            type: "number",
                            example: 4.5,
                        },
                        commentaryId: {
                            type: "string",
                            example: "commentary-123",
                        },
                        commentary: {
                            type: "string",
                            example: "Excelente filme.",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-04-07T20:15:00.000Z",
                        },
                    },
                },
                CreateVoteInput: {
                    type: "object",
                    required: ["userId", "groupId", "movieId", "rating"],
                    properties: {
                        userId: {
                            type: "string",
                            example: "user-123",
                        },
                        groupId: {
                            type: "string",
                            example: "group-123",
                        },
                        movieId: {
                            type: "string",
                            example: "movie-123",
                        },
                        rating: {
                            type: "number",
                            example: 4.5,
                        },
                        commentary: {
                            type: "string",
                            example: "Excelente filme.",
                        },
                    },
                },
                UpdateVoteInput: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            example: "user-123",
                        },
                        groupId: {
                            type: "string",
                            example: "group-123",
                        },
                        movieId: {
                            type: "string",
                            example: "movie-123",
                        },
                        rating: {
                            type: "number",
                            example: 4.5,
                        },
                        commentary: {
                            type: "string",
                            example: "Excelente filme.",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-04-07T20:15:00.000Z",
                        },
                    },
                },
                VoteMovieInput: {
                    type: "object",
                    required: ["userId", "groupId", "externalId", "rating", "commentary"],
                    properties: {
                        userId: {
                            type: "string",
                            example: "user-123",
                        },
                        groupId: {
                            type: "string",
                            example: "group-123",
                        },
                        externalId: {
                            type: "string",
                            example: "tt0111161",
                        },
                        rating: {
                            type: "number",
                            example: 4.5,
                        },
                        commentary: {
                            type: "string",
                            example: "Excelente filme.",
                        },
                        voteId: {
                            type: "string",
                            example: "9b2fd3b5-2c84-4f61-91d1-3fbac9ff1234",
                        },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "Not Found",
                        },
                        errorMessage: {
                            type: "string",
                            example: "Group not found",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/infrastructure/http/routes/*.ts"],
};

const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification;