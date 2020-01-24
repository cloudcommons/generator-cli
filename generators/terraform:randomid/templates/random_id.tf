locals {
    uid = random_id.cloudcommons.hex
}

resource "random_id" "cloudcommons" {
  byte_length = 4
}