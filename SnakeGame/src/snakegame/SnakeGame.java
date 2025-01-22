/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package snakegame;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.Random;
/**
 *
 * @author havib
 */

public class SnakeGame extends JPanel implements ActionListener {
    protected static final int TILE_SIZE = 20;
    protected static final int GRID_WIDTH = 30;
    protected static final int GRID_HEIGHT = 20;
    private static final int NUM_ROCKS = 15;
    private static final int DELAY = 200;

    private Snake snake;
    private Point food;
    private ArrayList<Rock> rocks;
    private int score;
    private Timer timer;
    
    public interface GameOverListener {
        void onGameOver(int score);
    }
    
    private GameOverListener gameOverListener;
    
    public void setGameOverListener(GameOverListener listener) {
        this.gameOverListener = listener;
    }

    public SnakeGame() {
        setPreferredSize(new Dimension(GRID_WIDTH * TILE_SIZE, GRID_HEIGHT * TILE_SIZE));
        setBackground(new Color(210, 180, 140));
        setFocusable(true);

        snake = new Snake(GRID_WIDTH / 2 * TILE_SIZE, GRID_HEIGHT / 2 * TILE_SIZE);
        score = 0;
        rocks = new ArrayList<>();
        placeFood();
        placeRocks();

        addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                switch (e.getKeyCode()) {
                    case KeyEvent.VK_UP -> snake.setDirection("UP");
                    case KeyEvent.VK_DOWN -> snake.setDirection("DOWN");
                    case KeyEvent.VK_LEFT -> snake.setDirection("LEFT");
                    case KeyEvent.VK_RIGHT -> snake.setDirection("RIGHT");
                }
            }
        });

        timer = new Timer(DELAY, this);
        timer.start();
    }

    private void placeFood() {
        Random rand = new Random();
        int maxAttempts = 100;
        int attempts = 0;

        while (attempts < maxAttempts) {
            int x = rand.nextInt(GRID_WIDTH) * TILE_SIZE;
            int y = rand.nextInt(GRID_HEIGHT) * TILE_SIZE;

            Point potentialFoodLocation = new Point(x, y);
            if (!snake.containsPoint(potentialFoodLocation) && !isRockAt(potentialFoodLocation)) {
                food = potentialFoodLocation;
                return;
            }
            attempts++;
        }
    }

    private void placeRocks() {
        rocks = new ArrayList<>();
        Random rand = new Random();

        int placedRocks = 0;
        while (placedRocks < NUM_ROCKS) {
            int x = rand.nextInt(GRID_WIDTH) * TILE_SIZE;
            int y = rand.nextInt(GRID_HEIGHT) * TILE_SIZE;

            Point rockPoint = new Point(x, y);

            if (!snake.containsPoint(rockPoint) && !rockPoint.equals(food) && !isRockAt(rockPoint)) {
                rocks.add(new Rock(x, y));
                placedRocks++;
            }
        }
    }

    private boolean isRockAt(Point point) {
        for (Rock rock : rocks) {
            if (rock.getLocation().equals(point)) return true;
        }
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        snake.move();

        if (snake.getHead().equals(food)) {
            snake.grow();
            score++;
            placeFood();
        }

        if (snake.checkSelfCollision() || snake.checkWallCollision(GRID_WIDTH, GRID_HEIGHT) || isRockAt(snake.getHead())) {
            timer.stop();
            if (gameOverListener != null) {
                gameOverListener.onGameOver(score);
            }
        }

        repaint();
    }
    
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        
        // Snake
        ArrayList<Point> body = snake.getBody();
        for (int i = 0; i < body.size(); i++) {
            if (i == 0) {
                g.setColor(new Color(0, 100, 0));
            } else {
                g.setColor(new Color(34, 139, 34));
            }
            Point p = body.get(i);
            g.fillRect(p.x, p.y, TILE_SIZE, TILE_SIZE);
        }

        // Food
        g.setColor(Color.RED);
        g.fillRect(food.x, food.y, TILE_SIZE, TILE_SIZE);

        // Rocks
        for (Rock rock : rocks) {
            rock.draw(g);
        }
    }    
}
