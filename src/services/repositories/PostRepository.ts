import { Post } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class PostRepository extends DokiRepository<Post> {
  constructor() {
    super("posts");
  }
}
