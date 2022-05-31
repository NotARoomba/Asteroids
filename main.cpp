#include <iostream>
#include <SDL.h>
#include <math.h>
#include <vector>

int SCREEN_WIDTH = 800;
int SCREEN_HEIGHT = 600;
struct {
	float x = SCREEN_WIDTH / 2;
	float y = SCREEN_HEIGHT / 2;
	float angle = 0;
	float xVel = 0;
	float yVel = 0;
	float speed = .05;
	
} ship;
struct {
	float x = SCREEN_WIDTH / 2;
	float y = SCREEN_HEIGHT / 2;
	float angle = 0;
	float xVel = 0;
	float yVel = 0;
	float speed = .05;

} asteroid;
SDL_FPoint rotatePoint(int x, int y, int cx, int cy, int angle)
{
	int x2 = cx + ((x - cx) * cos(angle * M_PI / 180)) - ((cy - y) * sin(angle * M_PI / 180));
	int y2 = cy + ((cy - y) * cos(angle * M_PI / 180)) + ((x - cx) * sin(angle * M_PI / 180));
	SDL_FPoint coords = { x2, y2 };
	return coords;
};
SDL_FPoint drawAsteroid(SDL_Renderer* renderer, float x, float y, float rotation) {
	//SDL_FPoint points[]
}
SDL_FPoint drawShip(SDL_Renderer* renderer, float x, float y, float rotation) {
	SDL_FPoint points[5] = {
		//tip
		{x, y},
		//right wing point
	  rotatePoint(x + 8, y - 30, x, y, rotation),
	//middle
		rotatePoint(x, y - 20, x, y, rotation),
		//left wind point
	  rotatePoint(x - 8, y - 30, x, y,rotation),
	  //tip
	  {x, y}
	};
	SDL_FPoint altPoints[5] = {points[0], points[1], points[2], points[3], points[4]};
	for (int i = 0; i < 5; i++) {
		if (points[i].x < 0.0f) {
			altPoints[i].x = (float)SCREEN_WIDTH + points[i].x;
			float diff[2] = { points[i].x - altPoints[i].x, points[i].y - altPoints[i].y };
			for (int i = 0; i < 5; i++)
			{
				altPoints[i].x = points[i].x - diff[0];
				altPoints[i].y = points[i].y - diff[1];
			}
		}
		if (points[i].x > (float)SCREEN_WIDTH) {
			altPoints[i].x = points[i].x - (float)SCREEN_WIDTH;
			float diff[2] = { points[i].x - altPoints[i].x, points[i].y - altPoints[i].y };
			for (int i = 0; i < 5; i++)
			{
				altPoints[i].x = points[i].x - diff[0];
				altPoints[i].y = points[i].y - diff[1];
			}
		}
		if (points[i].y < 0.0f) {
			altPoints[i].y = (float)SCREEN_HEIGHT + points[i].y;
			float diff[2] = { points[i].x - altPoints[i].x, points[i].y - altPoints[i].y };
			for (int i = 0; i < 5; i++)
			{
				altPoints[i].x = points[i].x - diff[0];
				altPoints[i].y = points[i].y - diff[1];
			}
		}
		if (points[i].y > (float)SCREEN_HEIGHT) {
			altPoints[i].y = points[i].y - (float)SCREEN_HEIGHT;
			float diff[2] = { points[i].x - altPoints[i].x, points[i].y - altPoints[i].y };
			for (int i = 0; i < 5; i++)
			{
				altPoints[i].x = points[i].x - diff[0];
				altPoints[i].y = points[i].y - diff[1];
			}
			std::cout << altPoints[i].y << std::endl;
		}
		
	}
	SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
	SDL_RenderDrawLinesF(renderer, points, 5);
	SDL_RenderDrawLinesF(renderer, altPoints, 5);
	return points[0].x < 0.0f || points[0].x > (float)SCREEN_WIDTH || points[0].y < 0.0f || points[0].y > (float)SCREEN_HEIGHT ? altPoints[0] : points[0];
};
int main(int argc, char** argv)
{
    SDL_Init(SDL_INIT_VIDEO);
    SDL_Window* window = SDL_CreateWindow("Asteroids", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, SCREEN_WIDTH, SCREEN_HEIGHT,SDL_WINDOW_RESIZABLE);
	SDL_Renderer* renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
	bool done = false;
	const Uint8* keys = SDL_GetKeyboardState(NULL);
    while (!done) {
		SDL_Event event;
		std::cout << "x: " << ship.x << " y: " << ship.y << " angle: " << ship.angle << " xVel: " << ship.xVel << " yVel: " << ship.yVel << std::endl;
		ship.xVel = ship.xVel > 1? 1 : ship.xVel < -1 ? -1 : ship.xVel;
		ship.yVel = ship.yVel > 1? 1 : ship.yVel < -1 ? -1 : ship.yVel;
		ship.x += ship.xVel;
		ship.y += ship.yVel;
		const Uint8* keystates = SDL_GetKeyboardState(NULL);
		while (SDL_PollEvent(&event)) {
			if (event.type == SDL_QUIT) {
				done = true;
			}
			if (event.window.event == SDL_WINDOWEVENT_RESIZED) {
				SCREEN_WIDTH = event.window.data1;
				SCREEN_HEIGHT = event.window.data2;
				SDL_SetRenderDrawColor(renderer, 0, 0, 0, SDL_ALPHA_OPAQUE);
				SDL_RenderClear(renderer);
			}
		}
		SDL_PumpEvents();
		if (keystates[SDL_SCANCODE_UP]) {
			ship.yVel -= ship.speed * cos(ship.angle * M_PI / 180);
			ship.xVel += ship.speed * sin(ship.angle * M_PI / 180);
		}
		if (keystates[SDL_SCANCODE_LEFT]) {
			ship.angle -= 3;
		}
		if (keystates[SDL_SCANCODE_RIGHT]) {
			ship.angle += 3;
		}
		SDL_SetRenderDrawColor(renderer, 0, 0, 0, SDL_ALPHA_OPAQUE);
		SDL_RenderClear(renderer);
		SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
		SDL_FPoint newShip = drawShip(renderer, ship.x, ship.y,ship.angle);
		ship.x = newShip.x;
		ship.y = newShip.y;
		SDL_RenderPresent(renderer);
	}

	if (renderer) {
		SDL_DestroyRenderer(renderer);
	}
	if (window) {
		SDL_DestroyWindow(window);
	}
    SDL_Quit();
    return 0;
}
