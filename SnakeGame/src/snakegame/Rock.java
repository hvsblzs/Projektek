/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package snakegame;

import java.awt.*;
/**
 *
 * @author havib
 */

public class Rock {
    private final Point location;

    public Rock(int x, int y) {
        this.location = new Point(x, y);
    }

    public Point getLocation() {
        return location;
    }

    public void draw(Graphics g) {
        g.setColor(Color.GRAY);
        g.fillRect(location.x, location.y, SnakeGame.TILE_SIZE, SnakeGame.TILE_SIZE);
    }
}

