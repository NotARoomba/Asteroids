#include <iostream>
#include <SDL.h>
#include <math.h>
#include <vector>
#include <stdlib.h>
#include <time.h> 

int screenWidth = 800;
int screenHeight = 600;


struct {
	float x = screenWidth / 2;
	float y = screenHeight / 2;
	float angle = 0;
	float xVel = 0;
	float yVel = 0;
	float speed = .05;
	std::vector<SDL_FPoint> shipPoints;
} ship;
struct asteroid {
	float x = screenWidth / 2;
	float y = screenHeight / 2;
	float angle = 0;
	float xVel = 0;
	float yVel = 0;
	float speed = 1;
	int size;

	asteroid(float x, float y, float angle, float xVel, float yVel, int size) {
		this->x = x;
		this->y = y;
		this->angle = angle;
		this->xVel = xVel;
		this->yVel = yVel;
		this->size = size;
	}
};
struct bullet {
	float x = ship.x;
	float y = ship.y;
	float xVel = 0;
	float yVel = 0;
	bullet(float x, float y, float angle, float xVel, float yVel) {
		this->x = x;
		this->y = y;
		this->xVel = xVel;
		this->yVel = yVel;
	}
};

std::vector<asteroid> asteroids;
std::vector<bullet> bullets;
bool done = false;
int score, level = 0;

std::vector<SDL_FPoint> rotatePointsAndScale(std::vector<SDL_FPoint> points, float angle, int scale = 1)
{
	std::vector<SDL_FPoint> newPoints;
	float cx = points[0].x;
	float cy = points[0].y;
	for (int i = 1; i < points.size()-1; i++)
	{
		float x = points[i].x;
		float y = points[i].y;
		float x2 = cx + (((x - cx) * scale) * cos(angle * M_PI / 180)) - (((cy - y) * scale) * sin(angle * M_PI / 180));
		float y2 = cy + (((cy - y) * scale) * cos(angle * M_PI / 180)) + (((x - cx) * scale) * sin(angle * M_PI / 180));
		points[i] = {x2, y2};
	}
	return points;
};
//check if point is inside polygon
bool checkifPointIsInsidePolygon(SDL_FPoint point, std::vector<SDL_FPoint> pointsOfPolygon) {
	int i, j = 0;
	bool c = false;
	for (i = 0, j = pointsOfPolygon.size() - 1; i < pointsOfPolygon.size(); j = i++) {
		if (((pointsOfPolygon[i].y > point.y) != (pointsOfPolygon[j].y > point.y)) &&
			(point.x < (pointsOfPolygon[j].x - pointsOfPolygon[i].x) * (point.y - pointsOfPolygon[i].y) / (pointsOfPolygon[j].y - pointsOfPolygon[i].y) + pointsOfPolygon[i].x))
			c = !c;
	}
	return c;
}

float generateRandom(float min, float max) {
	if (min > max)
	{
		std::swap(min, max);
	}
	return min + (float)rand() * (max - min) / (float)RAND_MAX;
}

void makeCopy(std::vector<SDL_FPoint>& points, std::vector<SDL_FPoint>& altPoints) {
	for (int i = 0; i < points.size(); i++) {
		if (points[i].x < 0.0f) {
			altPoints[i].x = (float)screenWidth + points[i].x;
			float diff[2] = { points[i].x - altPoints[i].x, points[i].y - altPoints[i].y };
			for (int j = 0; j < points.size(); j++)
			{
				altPoints[j].x = points[j].x - diff[0];
				altPoints[j].y = points[j].y - diff[1];
			}
		}
		if (points[i].x > (float)screenWidth) {
			altPoints[i].x = points[i].x - (float)screenWidth;
			float diff[2] = { points[i].x - altPoints[i].x, points[i].y - altPoints[i].y };
			for (int j = 0; j < points.size(); j++)
			{
				altPoints[j].x = points[j].x - diff[0];
				altPoints[j].y = points[j].y - diff[1];
			}
		}
		if (points[i].y < 0.0f) {
			altPoints[i].y = (float)screenHeight + points[i].y;
			float diff[2] = { points[i].x - altPoints[i].x, points[i].y - altPoints[i].y };
			for (int j = 0; j < points.size(); j++)
			{
				altPoints[j].x = points[j].x - diff[0];
				altPoints[j].y = points[j].y - diff[1];
			}
		}
		if (points[i].y > (float)screenHeight) {
			altPoints[i].y = points[i].y - (float)screenHeight;
			float diff[2] = { points[i].x - altPoints[i].x, points[i].y - altPoints[i].y };
			for (int j = 0; j < points.size(); j++)
			{
				altPoints[j].x = points[j].x - diff[0];
				altPoints[j].y = points[j].y - diff[1];
			}
		}

	}
}
void drawAsteroid(SDL_Renderer* renderer) {
	for (int k = 0; k < asteroids.size(); k++) {
		asteroids[k].x += asteroids[k].xVel;
		asteroids[k].y += asteroids[k].yVel;
		float x = asteroids[k].x;
		float y = asteroids[k].y;
		float rotation = asteroids[k].angle;
		int scale = asteroids[k].size;
		std::vector<SDL_FPoint> points = rotatePointsAndScale({ {x, y}, {x + 2, y - 1}, {x + 3, y + 1}, {x + 4, y + 3}, {x + 2, y + 5}, {x + 2, y + 6}, {x + 3, y + 7}, {x - 1, y + 9}, {x - 3, y + 7}, {x - 4, y + 8}, {x - 6, y + 7}, {x - 6, y + 4}, {x - 5, y + 2}, {x - 5, y - 0}, {x - 3, y + 1}, {x - 3, y - 1}, {x, y} }, rotation, scale);
		std::vector<SDL_FPoint> altPoints = points;
		makeCopy(points, altPoints);
		bool skip = false;
		for (int l = 0; l < bullets.size(); l++) {
			if (checkifPointIsInsidePolygon({ bullets[l].x, bullets[l].y }, points) || checkifPointIsInsidePolygon({ bullets[l].x, bullets[l].y }, altPoints)) {
				bullets.erase(bullets.begin() + l);
				if (asteroids[k].size > 3) {
					asteroids.emplace_back(asteroids[k].x, asteroids[k].y, asteroids[k].angle, generateRandom(-1, 1), generateRandom(-1, 1), asteroids[k].size / 2);
					asteroids.emplace_back(asteroids[k].x, asteroids[k].y, asteroids[k].angle, generateRandom(-1, 1), generateRandom(-1, 1), asteroids[k].size / 2);
				}
				asteroids.erase(asteroids.begin() + k);
				score++;
				std::cout << "Score: " << score << std::endl;
				skip = true;
				break;
			}
		};
		if (skip) continue;
		for (int l = 0; l < ship.shipPoints.size(); l++) {
			if (checkifPointIsInsidePolygon({ ship.shipPoints[l].x, ship.shipPoints[l].y }, points) || checkifPointIsInsidePolygon({ ship.shipPoints[l].x, ship.shipPoints[l].y }, altPoints)) {
				done = true;
			}
		};
		SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
		SDL_RenderDrawLinesF(renderer, &points[0], 17);
		SDL_RenderDrawLinesF(renderer, &altPoints[0], 17);
		asteroids[k].x = points[0].x < 0.0f || points[0].x >(float)screenWidth || points[0].y < 0.0f || points[0].y >(float)screenHeight ? altPoints[0].x : points[0].x;
		asteroids[k].y = points[0].x < 0.0f || points[0].x >(float)screenWidth || points[0].y < 0.0f || points[0].y >(float)screenHeight ? altPoints[0].y : points[0].y;
	}
};
SDL_FPoint drawShip(SDL_Renderer* renderer) {
	ship.xVel = ship.xVel > 1 ? 1 : ship.xVel < -1 ? -1 : ship.xVel;
	ship.yVel = ship.yVel > 1 ? 1 : ship.yVel < -1 ? -1 : ship.yVel;
	float x = ship.x += ship.xVel;
	float y = ship.y += ship.yVel;
	std::vector<SDL_FPoint> points = rotatePointsAndScale({{x, y}, {x + 8, y - 30}, {x, y - 20}, {x - 8, y - 30}, {x, y} }, ship.angle);
	std::vector<SDL_FPoint> altPoints;
	altPoints = ship.shipPoints = points;
	makeCopy(points, altPoints);
	SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
	SDL_RenderDrawLinesF(renderer, &points[0], 5);
	SDL_RenderDrawLinesF(renderer, &altPoints[0], 5);
	ship.x = points[0].x < 0.0f || points[0].x >(float)screenWidth || points[0].y < 0.0f || points[0].y >(float)screenHeight ? altPoints[0].x : points[0].x;
	ship.y = points[0].x < 0.0f || points[0].x >(float)screenWidth || points[0].y < 0.0f || points[0].y >(float)screenHeight ? altPoints[0].y : points[0].y;
};
void drawBullets(SDL_Renderer* renderer) {
	for (int i = 0; i < bullets.size(); i++) {
		bullets[i].x += bullets[i].xVel;
		bullets[i].y += bullets[i].yVel;
		std::vector<SDL_FPoint> points = {
			{ bullets[i].x, bullets[i].y },
			{ bullets[i].x + 2, bullets[i].y },
			{ bullets[i].x + 2, bullets[i].y + 2 },
			{bullets [i].x, bullets[i].y + 2 },
			{ bullets[i].x, bullets[i].y }
		};
		//std::vector<SDL_FPoint> altPoints = points;
		//makeCopy(points, altPoints);
		for (int j = 0; j < 5; j++) {
			if (points[j].x < 0.0f || points[j].x > (float)screenWidth || points[j].y < 0.0f || points[j].y > (float)screenHeight) {
				bullets.erase(bullets.begin() + i);
				break;
			}
		}
	SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
	SDL_RenderDrawLinesF(renderer, &points[0], 5);
	//SDL_RenderDrawLinesF(renderer, &altPoints[0], 5);
	//bullets[i].x = points[0].x < 0.0f || points[0].x >(float)screenWidth || points[0].y < 0.0f || points[0].y >(float)screenHeight ? altPoints[0].x : points[0].x;
	//bullets[i].y = points[0].x < 0.0f || points[0].x >(float)screenWidth || points[0].y < 0.0f || points[0].y >(float)screenHeight ? altPoints[0].y : points[0].y;
	}
}
int main(int argc, char** argv)
{
	srand(time(NULL));
    SDL_Init(SDL_INIT_VIDEO);
    SDL_Window* window = SDL_CreateWindow("Asteroids", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, screenWidth, screenHeight,SDL_WINDOW_RESIZABLE);
	SDL_Renderer* renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
	const Uint8* keys = SDL_GetKeyboardState(NULL);
    while (!done) { 
		if (asteroids.size() == 0 ) {
			level++;
			for (int i = 0; i < level + 4; i++) {
				float x, y;
				do {
					x = rand() % (int)screenWidth;
					y = rand() % (int)screenHeight;
					} while (sqrt(pow(x - ship.x, 2) + pow(y - ship.y, 2)) < 200);
				asteroids.emplace_back(x, y, rand() % 361, generateRandom(-1, 1), generateRandom(-1, 1), 12);
			}
			std::cout << "Level " << level << std::endl;
		}
		SDL_Event event;
		const Uint8* keystates = SDL_GetKeyboardState(NULL);
		while (SDL_PollEvent(&event)) {
			if (event.type == SDL_QUIT) {
				done = true;
			}
			if (event.window.event == SDL_WINDOWEVENT_RESIZED) {
				screenWidth = event.window.data1;
				screenHeight = event.window.data2;
				SDL_SetRenderDrawColor(renderer, 0, 0, 0, SDL_ALPHA_OPAQUE);
				SDL_RenderClear(renderer);
			}
			if (event.key.keysym.sym == SDLK_SPACE && event.type == SDL_KEYUP) {
				bullets.emplace_back(ship.x, ship.y, ship.angle, 10 * sin(ship.angle * M_PI / 180), -10 * cos(ship.angle * M_PI / 180));
			}
		}
		SDL_PumpEvents();
		if (keystates[SDL_SCANCODE_UP]) {
			ship.xVel += ship.speed * sin(ship.angle * M_PI / 180);
			ship.yVel -= ship.speed * cos(ship.angle * M_PI / 180);
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
		drawShip(renderer);
		drawBullets(renderer);
		drawAsteroid(renderer);
		SDL_RenderPresent(renderer);
	}
	if (renderer) {
		SDL_DestroyRenderer(renderer);
	}
	if (window) {
		SDL_DestroyWindow(window);
	}
    SDL_Quit();
	std::cout << "+--Game Over--+" << std::endl;
	std::cout << "Score: " << score << std::endl;
	std::cout << "Level: " << level << std::endl;
	std::cout << "Press Enter to continue" << std::endl;
	std::cin.get();
    return 0;
}
