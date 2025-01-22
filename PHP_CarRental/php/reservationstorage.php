<?php
include_once('storage.php');

class ReservationStorage extends Storage {
  public function __construct() {
    parent::__construct(new JsonIO('../jsons/reservations.json'));
  }
}