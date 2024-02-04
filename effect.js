'use strict';

import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Graphene from 'gi://Graphene';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Cursor from './cursor.js';


export default class Effect extends St.Icon {
    static {
        GObject.registerClass(this);
    }

    constructor() {
        super();
        this.gicon = Gio.Icon.new_for_string(GLib.path_get_dirname(import.meta.url.slice(7))+"/icons/cursor.png");
        this.cursor = new Cursor();
    }

    move(x, y) {
        this.set_icon_size(96);
        this.set_position(x-12, y-6);
    }

    magnify() {
        Main.uiGroup.add_actor(this);
        this.cursor.hide();
        this.remove_all_transitions();
        this.ease({
            duration: 250,
            transition: Clutter.AnimationMode.EASE_IN_QUAD,
            scale_x: 1.0,
            scale_y: 1.0,
            pivot_point: new Graphene.Point({x: 0.125, y: 0.0625}),
        })
    }

    unmagnify() {
        this.remove_all_transitions();
        this.ease({
            duration: 150,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            scale_x: 0.25,
            scale_y: 0.25,
            pivot_point: new Graphene.Point({x: 0.125, y: 0.0625}),
            onComplete: () => {
                Main.uiGroup.remove_actor(this);
                this.cursor.show();
            }
        });
    }
}