
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/CustomInput.svelte generated by Svelte v3.59.2 */

    const file$2 = "src/CustomInput.svelte";

    function create_fragment$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			add_location(input, file$2, 9, 0, 104);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*val*/ ctx[0]);
    			/*input_binding*/ ctx[4](input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*val*/ 1 && input.value !== /*val*/ ctx[0]) {
    				set_input_value(input, /*val*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CustomInput', slots, []);
    	let { val } = $$props;
    	let { val_2 } = $$props;

    	function empty() {
    		$$invalidate(0, val = '');
    	}

    	$$self.$$.on_mount.push(function () {
    		if (val === undefined && !('val' in $$props || $$self.$$.bound[$$self.$$.props['val']])) {
    			console.warn("<CustomInput> was created without expected prop 'val'");
    		}

    		if (val_2 === undefined && !('val_2' in $$props || $$self.$$.bound[$$self.$$.props['val_2']])) {
    			console.warn("<CustomInput> was created without expected prop 'val_2'");
    		}
    	});

    	const writable_props = ['val', 'val_2'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CustomInput> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		val = this.value;
    		$$invalidate(0, val);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			val_2 = $$value;
    			$$invalidate(1, val_2);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('val' in $$props) $$invalidate(0, val = $$props.val);
    		if ('val_2' in $$props) $$invalidate(1, val_2 = $$props.val_2);
    	};

    	$$self.$capture_state = () => ({ val, val_2, empty });

    	$$self.$inject_state = $$props => {
    		if ('val' in $$props) $$invalidate(0, val = $$props.val);
    		if ('val_2' in $$props) $$invalidate(1, val_2 = $$props.val_2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [val, val_2, empty, input_input_handler, input_binding];
    }

    class CustomInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { val: 0, val_2: 1, empty: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomInput",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get val() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get val_2() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val_2(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get empty() {
    		return this.$$.ctx[2];
    	}

    	set empty(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Toggle.svelte generated by Svelte v3.59.2 */

    const file$1 = "src/Toggle.svelte";

    function create_fragment$1(ctx) {
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let button1;
    	let t2;
    	let button1_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			t0 = text("Option 1");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("Option 2");
    			button0.disabled = button0_disabled_value = /*chosenOption*/ ctx[0] === 1;
    			add_location(button0, file$1, 4, 0, 51);
    			button1.disabled = button1_disabled_value = /*chosenOption*/ ctx[0] === 2;
    			add_location(button1, file$1, 7, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chosenOption*/ 1 && button0_disabled_value !== (button0_disabled_value = /*chosenOption*/ ctx[0] === 1)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*chosenOption*/ 1 && button1_disabled_value !== (button1_disabled_value = /*chosenOption*/ ctx[0] === 2)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toggle', slots, []);
    	let { chosenOption = 1 } = $$props;
    	const writable_props = ['chosenOption'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toggle> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, chosenOption = 1);
    	const click_handler_1 = () => $$invalidate(0, chosenOption = 2);

    	$$self.$$set = $$props => {
    		if ('chosenOption' in $$props) $$invalidate(0, chosenOption = $$props.chosenOption);
    	};

    	$$self.$capture_state = () => ({ chosenOption });

    	$$self.$inject_state = $$props => {
    		if ('chosenOption' in $$props) $$invalidate(0, chosenOption = $$props.chosenOption);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [chosenOption, click_handler, click_handler_1];
    }

    class Toggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { chosenOption: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get chosenOption() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chosenOption(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let custominput;
    	let updating_val;
    	let updating_val_2;
    	let t0;
    	let input0;
    	let t1;
    	let toggle;
    	let updating_chosenOption;
    	let t2;
    	let h10;
    	let t4;
    	let input1;
    	let t5;
    	let input2;
    	let t6;
    	let label0;
    	let input3;
    	let t7;
    	let t8;
    	let h11;
    	let t10;
    	let label1;
    	let input4;
    	let t11;
    	let t12;
    	let label2;
    	let input5;
    	let t13;
    	let t14;
    	let label3;
    	let input6;
    	let t15;
    	let t16;
    	let h12;
    	let t18;
    	let label4;
    	let input7;
    	let t19;
    	let t20;
    	let label5;
    	let input8;
    	let t21;
    	let t22;
    	let label6;
    	let input9;
    	let t23;
    	let t24;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let t28;
    	let hr;
    	let t29;
    	let button;
    	let t31;
    	let div;
    	let t32;
    	let current;
    	let binding_group;
    	let mounted;
    	let dispose;

    	function custominput_val_binding(value) {
    		/*custominput_val_binding*/ ctx[11](value);
    	}

    	function custominput_val_2_binding(value) {
    		/*custominput_val_2_binding*/ ctx[13](value);
    	}

    	let custominput_props = {};

    	if (/*value*/ ctx[0] !== void 0) {
    		custominput_props.val = /*value*/ ctx[0];
    	}

    	if (/*customInput_2*/ ctx[9] !== void 0) {
    		custominput_props.val_2 = /*customInput_2*/ ctx[9];
    	}

    	custominput = new CustomInput({ props: custominput_props, $$inline: true });
    	binding_callbacks.push(() => bind(custominput, 'val', custominput_val_binding));
    	/*custominput_binding*/ ctx[12](custominput);
    	binding_callbacks.push(() => bind(custominput, 'val_2', custominput_val_2_binding));

    	function toggle_chosenOption_binding(value) {
    		/*toggle_chosenOption_binding*/ ctx[15](value);
    	}

    	let toggle_props = {};

    	if (/*selectedOption*/ ctx[1] !== void 0) {
    		toggle_props.chosenOption = /*selectedOption*/ ctx[1];
    	}

    	toggle = new Toggle({ props: toggle_props, $$inline: true });
    	binding_callbacks.push(() => bind(toggle, 'chosenOption', toggle_chosenOption_binding));
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[20][0]);

    	const block = {
    		c: function create() {
    			create_component(custominput.$$.fragment);
    			t0 = space();
    			input0 = element("input");
    			t1 = space();
    			create_component(toggle.$$.fragment);
    			t2 = space();
    			h10 = element("h1");
    			h10.textContent = "Bindings & Forms";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			input2 = element("input");
    			t6 = space();
    			label0 = element("label");
    			input3 = element("input");
    			t7 = text("\n  Agree to terms?");
    			t8 = space();
    			h11 = element("h1");
    			h11.textContent = "FAVORITE COLOR";
    			t10 = space();
    			label1 = element("label");
    			input4 = element("input");
    			t11 = text("\n  Red");
    			t12 = space();
    			label2 = element("label");
    			input5 = element("input");
    			t13 = text("\n  Green");
    			t14 = space();
    			label3 = element("label");
    			input6 = element("input");
    			t15 = text("\n  Blue");
    			t16 = space();
    			h12 = element("h1");
    			h12.textContent = "FAVORITE COLOR";
    			t18 = space();
    			label4 = element("label");
    			input7 = element("input");
    			t19 = text("\n  Red");
    			t20 = space();
    			label5 = element("label");
    			input8 = element("input");
    			t21 = text("\n  Green");
    			t22 = space();
    			label6 = element("label");
    			input9 = element("input");
    			t23 = text("\n  Blue");
    			t24 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Green";
    			option1 = element("option");
    			option1.textContent = "Red";
    			option2 = element("option");
    			option2.textContent = "Blue";
    			t28 = space();
    			hr = element("hr");
    			t29 = space();
    			button = element("button");
    			button.textContent = "Save";
    			t31 = space();
    			div = element("div");
    			t32 = text(/*value*/ ctx[0]);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file, 51, 0, 1129);
    			add_location(h10, file, 56, 0, 1226);
    			attr_dev(input1, "type", "number");
    			input1.value = /*price*/ ctx[2];
    			add_location(input1, file, 58, 0, 1253);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file, 65, 0, 1379);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "name", "");
    			attr_dev(input3, "id", "");
    			add_location(input3, file, 68, 2, 1433);
    			add_location(label0, file, 67, 0, 1423);
    			add_location(h11, file, 72, 0, 1523);
    			attr_dev(input4, "type", "radio");
    			attr_dev(input4, "name", "color");
    			input4.__value = "red";
    			input4.value = input4.__value;
    			add_location(input4, file, 74, 2, 1557);
    			add_location(label1, file, 73, 0, 1547);
    			attr_dev(input5, "type", "radio");
    			attr_dev(input5, "name", "color");
    			input5.__value = "green";
    			input5.value = input5.__value;
    			add_location(input5, file, 78, 2, 1649);
    			add_location(label2, file, 77, 0, 1639);
    			attr_dev(input6, "type", "radio");
    			attr_dev(input6, "name", "color");
    			input6.__value = "blue";
    			input6.value = input6.__value;
    			add_location(input6, file, 82, 2, 1745);
    			add_location(label3, file, 81, 0, 1735);
    			add_location(h12, file, 86, 0, 1830);
    			attr_dev(input7, "type", "checkbox");
    			attr_dev(input7, "name", "color");
    			input7.__value = "red";
    			input7.value = input7.__value;
    			add_location(input7, file, 88, 2, 1864);
    			add_location(label4, file, 87, 0, 1854);
    			attr_dev(input8, "type", "checkbox");
    			attr_dev(input8, "name", "color");
    			input8.__value = "green";
    			input8.value = input8.__value;
    			add_location(input8, file, 92, 2, 2013);
    			add_location(label5, file, 91, 0, 2003);
    			attr_dev(input9, "type", "checkbox");
    			attr_dev(input9, "name", "color");
    			input9.__value = "blue";
    			input9.value = input9.__value;
    			add_location(input9, file, 96, 2, 2112);
    			add_location(label6, file, 95, 0, 2102);
    			option0.__value = "green";
    			option0.value = option0.__value;
    			add_location(option0, file, 101, 2, 2237);
    			option1.__value = "red";
    			option1.value = option1.__value;
    			add_location(option1, file, 102, 2, 2276);
    			option2.__value = "blue";
    			option2.value = option2.__value;
    			add_location(option2, file, 103, 2, 2311);
    			if (/*colorOptions*/ ctx[5] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[27].call(select));
    			add_location(select, file, 100, 0, 2200);
    			add_location(hr, file, 106, 0, 2357);
    			add_location(button, file, 108, 0, 2365);
    			add_location(div, file, 110, 0, 2408);
    			binding_group.p(input4, input5, input6, input7, input8, input9);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(custominput, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, input0, anchor);
    			/*input0_binding*/ ctx[14](input0);
    			insert_dev(target, t1, anchor);
    			mount_component(toggle, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*price*/ ctx[2]);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, label0, anchor);
    			append_dev(label0, input3);
    			input3.checked = /*agreed*/ ctx[3];
    			append_dev(label0, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h11, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, label1, anchor);
    			append_dev(label1, input4);
    			input4.checked = input4.__value === /*color*/ ctx[4];
    			append_dev(label1, t11);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, label2, anchor);
    			append_dev(label2, input5);
    			input5.checked = input5.__value === /*color*/ ctx[4];
    			append_dev(label2, t13);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, label3, anchor);
    			append_dev(label3, input6);
    			input6.checked = input6.__value === /*color*/ ctx[4];
    			append_dev(label3, t15);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, h12, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, label4, anchor);
    			append_dev(label4, input7);
    			input7.checked = ~(/*color*/ ctx[4] || []).indexOf(input7.__value);
    			append_dev(label4, t19);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, label5, anchor);
    			append_dev(label5, input8);
    			input8.checked = ~(/*color*/ ctx[4] || []).indexOf(input8.__value);
    			append_dev(label5, t21);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, label6, anchor);
    			append_dev(label6, input9);
    			input9.checked = ~(/*color*/ ctx[4] || []).indexOf(input9.__value);
    			append_dev(label6, t23);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, select, anchor);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			select_option(select, /*colorOptions*/ ctx[5], true);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t32);
    			/*div_binding*/ ctx[28](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input1, "input", /*input_handler*/ ctx[16], false, false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[17]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[18]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[19]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[21]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[22]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[23]),
    					listen_dev(input7, "input", /*input_handler_1*/ ctx[24], false, false, false, false),
    					listen_dev(input8, "change", /*input8_change_handler*/ ctx[25]),
    					listen_dev(input9, "change", /*input9_change_handler*/ ctx[26]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[27]),
    					listen_dev(button, "click", /*saveData*/ ctx[10], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const custominput_changes = {};

    			if (!updating_val && dirty & /*value*/ 1) {
    				updating_val = true;
    				custominput_changes.val = /*value*/ ctx[0];
    				add_flush_callback(() => updating_val = false);
    			}

    			if (!updating_val_2 && dirty & /*customInput_2*/ 512) {
    				updating_val_2 = true;
    				custominput_changes.val_2 = /*customInput_2*/ ctx[9];
    				add_flush_callback(() => updating_val_2 = false);
    			}

    			custominput.$set(custominput_changes);
    			const toggle_changes = {};

    			if (!updating_chosenOption && dirty & /*selectedOption*/ 2) {
    				updating_chosenOption = true;
    				toggle_changes.chosenOption = /*selectedOption*/ ctx[1];
    				add_flush_callback(() => updating_chosenOption = false);
    			}

    			toggle.$set(toggle_changes);

    			if (!current || dirty & /*price*/ 4 && input1.value !== /*price*/ ctx[2]) {
    				prop_dev(input1, "value", /*price*/ ctx[2]);
    			}

    			if (dirty & /*price*/ 4 && to_number(input2.value) !== /*price*/ ctx[2]) {
    				set_input_value(input2, /*price*/ ctx[2]);
    			}

    			if (dirty & /*agreed*/ 8) {
    				input3.checked = /*agreed*/ ctx[3];
    			}

    			if (dirty & /*color*/ 16) {
    				input4.checked = input4.__value === /*color*/ ctx[4];
    			}

    			if (dirty & /*color*/ 16) {
    				input5.checked = input5.__value === /*color*/ ctx[4];
    			}

    			if (dirty & /*color*/ 16) {
    				input6.checked = input6.__value === /*color*/ ctx[4];
    			}

    			if (dirty & /*color*/ 16) {
    				input7.checked = ~(/*color*/ ctx[4] || []).indexOf(input7.__value);
    			}

    			if (dirty & /*color*/ 16) {
    				input8.checked = ~(/*color*/ ctx[4] || []).indexOf(input8.__value);
    			}

    			if (dirty & /*color*/ 16) {
    				input9.checked = ~(/*color*/ ctx[4] || []).indexOf(input9.__value);
    			}

    			if (dirty & /*colorOptions*/ 32) {
    				select_option(select, /*colorOptions*/ ctx[5]);
    			}

    			if (!current || dirty & /*value*/ 1) set_data_dev(t32, /*value*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custominput.$$.fragment, local);
    			transition_in(toggle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custominput.$$.fragment, local);
    			transition_out(toggle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*custominput_binding*/ ctx[12](null);
    			destroy_component(custominput, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input0);
    			/*input0_binding*/ ctx[14](null);
    			if (detaching) detach_dev(t1);
    			destroy_component(toggle, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h11);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(label1);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(label2);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(label3);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(h12);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(label4);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(label5);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(label6);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(select);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[28](null);
    			binding_group.r();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let value = 'Max';
    	let selectedOption = 1;
    	let price = 0;
    	let agreed;
    	let color = 'red';
    	let colorOptions = '';
    	let usernameInput;
    	let someDiv;
    	let customInput;
    	let customInput_2;
    	let someDiv_2;

    	function setValue(event) {
    		$$invalidate(0, value = event.target.value);
    	}

    	function saveData() {
    		console.log('1', usernameInput.value);
    		console.log('2', someDiv);
    		console.log('3', customInput.value);
    		console.log('4', customInput_2.value);
    		console.log('this', this);
    		customInput.empty();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function custominput_val_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function custominput_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			customInput = $$value;
    			$$invalidate(7, customInput);
    		});
    	}

    	function custominput_val_2_binding(value) {
    		customInput_2 = value;
    		$$invalidate(9, customInput_2);
    	}

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			usernameInput = $$value;
    			$$invalidate(8, usernameInput);
    		});
    	}

    	function toggle_chosenOption_binding(value) {
    		selectedOption = value;
    		$$invalidate(1, selectedOption);
    	}

    	const input_handler = event => console.log(event.target.value);

    	function input2_input_handler() {
    		price = to_number(this.value);
    		$$invalidate(2, price);
    	}

    	function input3_change_handler() {
    		agreed = this.checked;
    		$$invalidate(3, agreed);
    	}

    	function input4_change_handler() {
    		color = this.__value;
    		$$invalidate(4, color);
    	}

    	function input5_change_handler() {
    		color = this.__value;
    		$$invalidate(4, color);
    	}

    	function input6_change_handler() {
    		color = this.__value;
    		$$invalidate(4, color);
    	}

    	function input7_change_handler() {
    		color = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, color);
    	}

    	const input_handler_1 = event => console.log(event.target.value);

    	function input8_change_handler() {
    		color = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, color);
    	}

    	function input9_change_handler() {
    		color = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, color);
    	}

    	function select_change_handler() {
    		colorOptions = select_value(this);
    		$$invalidate(5, colorOptions);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			someDiv = $$value;
    			$$invalidate(6, someDiv);
    		});
    	}

    	$$self.$capture_state = () => ({
    		CustomInput,
    		Toggle,
    		value,
    		selectedOption,
    		price,
    		agreed,
    		color,
    		colorOptions,
    		usernameInput,
    		someDiv,
    		customInput,
    		customInput_2,
    		someDiv_2,
    		setValue,
    		saveData
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('selectedOption' in $$props) $$invalidate(1, selectedOption = $$props.selectedOption);
    		if ('price' in $$props) $$invalidate(2, price = $$props.price);
    		if ('agreed' in $$props) $$invalidate(3, agreed = $$props.agreed);
    		if ('color' in $$props) $$invalidate(4, color = $$props.color);
    		if ('colorOptions' in $$props) $$invalidate(5, colorOptions = $$props.colorOptions);
    		if ('usernameInput' in $$props) $$invalidate(8, usernameInput = $$props.usernameInput);
    		if ('someDiv' in $$props) $$invalidate(6, someDiv = $$props.someDiv);
    		if ('customInput' in $$props) $$invalidate(7, customInput = $$props.customInput);
    		if ('customInput_2' in $$props) $$invalidate(9, customInput_2 = $$props.customInput_2);
    		if ('someDiv_2' in $$props) someDiv_2 = $$props.someDiv_2;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			console.log(value);
    		}

    		if ($$self.$$.dirty & /*selectedOption*/ 2) {
    			console.log(selectedOption);
    		}

    		if ($$self.$$.dirty & /*price*/ 4) {
    			console.log(price);
    		}

    		if ($$self.$$.dirty & /*agreed*/ 8) {
    			console.log(agreed);
    		}

    		if ($$self.$$.dirty & /*color*/ 16) {
    			console.log(color);
    		}

    		if ($$self.$$.dirty & /*colorOptions*/ 32) {
    			console.log(colorOptions);
    		}

    		if ($$self.$$.dirty & /*customInput*/ 128) {
    			console.log('customInput output', customInput);
    		}

    		if ($$self.$$.dirty & /*someDiv*/ 64) {
    			console.log(someDiv);
    		}
    	};

    	return [
    		value,
    		selectedOption,
    		price,
    		agreed,
    		color,
    		colorOptions,
    		someDiv,
    		customInput,
    		usernameInput,
    		customInput_2,
    		saveData,
    		custominput_val_binding,
    		custominput_binding,
    		custominput_val_2_binding,
    		input0_binding,
    		toggle_chosenOption_binding,
    		input_handler,
    		input2_input_handler,
    		input3_change_handler,
    		input4_change_handler,
    		$$binding_groups,
    		input5_change_handler,
    		input6_change_handler,
    		input7_change_handler,
    		input_handler_1,
    		input8_change_handler,
    		input9_change_handler,
    		select_change_handler,
    		div_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
